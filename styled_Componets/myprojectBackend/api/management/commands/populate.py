import random
from decimal import Decimal
from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model

from api.models import (
    Cabins,
    Guests,
    Bookings,
    Settings,
)  

def random_date_within(days_back=365):
    """Return a random date within the past `days_back` days (including today)."""
    days = random.randint(0, days_back)
    return date.today() - timedelta(days=days)


class Command(BaseCommand):
    help = "Populate demo data for Cabins, Guests, Bookings and Settings."

    def add_arguments(self, parser):
        parser.add_argument(
            "--cabins",
            type=int,
            default=5,
            help="Number of cabins to create (default=5)",
        )
        parser.add_argument(
            "--guests",
            type=int,
            default=20,
            help="Number of guests to create (default=20)",
        )
        parser.add_argument(
            "--bookings",
            type=int,
            default=10,
            help="Number of bookings to create (default=10)",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        User = get_user_model()

        cabin_count = options["cabins"]
        guest_count = options["guests"]
        booking_count = options["bookings"]

        # Create or get demo user
        demo_user, created = User.objects.get_or_create(
            username="demo_user", defaults={"email": "demo@example.com"}
        )
        if created:
            demo_user.set_password("demo12345")
            demo_user.save()
            self.stdout.write(self.style.SUCCESS("Created demo user: demo_user"))

        # 1) Create Settings (single row)
        Settings.objects.all().delete()
        s = Settings.objects.create(
            created_at=date.today(),
            minBookingLength=1,
            maxBookingLength=7,
            minGuestsPerBooking=1,
            breakfastPrice=Decimal("5.00"),
        )
        self.stdout.write(self.style.SUCCESS("Created Settings row"))

        # 2) Create Guests
        Guests.objects.all().delete()
        guest_objs = []
        for i in range(guest_count):
            g = Guests(
                created_at=random_date_within(180),
                fullName=f"Guest {i+1} Demo",
                email=f"guest{i+1}_demo@example.com",
                nationalID=1000000000 + i,
                nationality=random.choice(["India", "USA", "UK", "Spain", "Brazil"]),
                # countryFlag left blank (ImageField optional)
            )
            guest_objs.append(g)
        Guests.objects.bulk_create(guest_objs)
        guests = list(Guests.objects.all())
        self.stdout.write(self.style.SUCCESS(f"Created {len(guests)} Guests"))

        # 3) Create Cabins
        Cabins.objects.all().delete()
        cabin_objs = []
        for i in range(cabin_count):
            # maxCapacity: your validators allow 1..2 (based on the model you shared).
            max_capacity = random.choice([1, 2])
            regular_price = Decimal(str(round(random.uniform(50.0, 500.0), 2)))
            discount = (
                Decimal(str(round(random.uniform(0, 50), 2)))
                if random.random() < 0.5
                else None
            )

            c = Cabins(
                user=demo_user,
                created_at=random_date_within(300),
                name=f"Demo Cabin {i+1}",
                maxCapacity=max_capacity,
                regularPrice=regular_price,
                discount=discount,
                observations="Demo cabin for testing",
                # image left blank
            )
            cabin_objs.append(c)
        Cabins.objects.bulk_create(cabin_objs)
        cabins = list(Cabins.objects.all())
        self.stdout.write(self.style.SUCCESS(f"Created {len(cabins)} Cabins"))

        # 4) Create Bookings
        Bookings.objects.all().delete()
        booking_objs = []
        # Because cabin is OneToOne with booking, only create up to number of cabins
        bookings_to_create = min(booking_count, len(cabins))
        # used_cabin_indices = set()
        for i in range(bookings_to_create):
            # # pick an unused cabin (because OneToOne) *
            # available_indices = [
            #     idx for idx in range(len(cabins)) if idx not in used_cabin_indices
            # ]
            # available_indices=random.choices(cabins)
            # if not available_indices:
            #     break
            # ci = random.choice(available_indices)
            # used_cabin_indices.add(ci)
            # cabin = cabins[random.choice(cabins)]
            cabin = random.choice(cabins)

            num_nights = random.randint(1, 7)  # within validators
            num_guests = random.randint(
                1, min(4, cabin.maxCapacity)
            )  # within validators and capacity
            cabin_price = cabin.regularPrice
            extras_price = (
                Decimal(str(round(random.uniform(0, 100), 2)))
                if random.random() < 0.5
                else Decimal("0.00")
            )
            total_price = (Decimal(num_nights) * cabin_price) + extras_price

            start = date.today() + timedelta(days=random.randint(0, 30))
            end = start + timedelta(days=num_nights)

            b = Bookings(
                user=demo_user,
                created_at=random_date_within(300),
                startDate=start,
                endDate=end,
                numNights=num_nights,
                numGuests=num_guests,
                cabinPrice=cabin_price,
                extrasPrice=extras_price,
                totalPrice=total_price,
                status=random.choice([True, False]),
                isPaid=random.choice([True, False]),
                observations="Demo booking autogenerated",
                cabin=cabin,
                guest=random.choice(guests),
            )
            booking_objs.append(b)

        # Bulk create bookings
        Bookings.objects.bulk_create(booking_objs)
        self.stdout.write(self.style.SUCCESS(f"Created {len(booking_objs)} Bookings"))

        self.stdout.write(self.style.SUCCESS("Demo data population complete."))
