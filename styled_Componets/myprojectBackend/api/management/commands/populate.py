# management/commands/populate.py
import email
import random
from decimal import Decimal
from datetime import date, timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model
from faker import Faker

from api.models import Cabins, Guests, Bookings, Settings

from decimal import Decimal, ROUND_HALF_UP
fake = Faker()

def random_date_within(days_back=365):
    days = random.randint(0, days_back)
    return date.today() - timedelta(days=days)

class Command(BaseCommand):
    help = "Populate demo data efficiently (chunked bulk_create)."

    def add_arguments(self, parser):
        parser.add_argument("--cabins", type=int, default=5000)
        parser.add_argument("--guests", type=int, default=10000)
        parser.add_argument("--bookings", type=int, default=20000)
        parser.add_argument("--chunk", type=int, default=5000,
                            help="Chunk size for bulk_create (default 5000)")

    @transaction.atomic
    def handle(self, *args, **options):
        User = get_user_model()
        User.objects.exclude(email="demo@example.com").delete
        cabin_count = options["cabins"]
        guest_count = options["guests"]
        booking_count = options["bookings"]
        chunk_size = options["chunk"]

        demo_user, created = User.objects.get_or_create(
            name="demo_user", defaults={"email": "demo@example.com"}
        )
        if created:
            demo_user.set_password("demo12345")
            demo_user.save()
            self.stdout.write(self.style.SUCCESS("Created demo user"))

        # Settings
        Settings.objects.all().delete()
        Settings.objects.create(
            created_at=date.today(),
            minBookingLength=1,
            maxBookingLength=7,
            minGuestsPerBooking=1,
            breakfastPrice=Decimal("5.00"),
        )
        self.stdout.write(self.style.SUCCESS("Settings created"))

        # Guests (chunked)
        Guests.objects.all().delete()
        guest_objs = []
        next_national_id = 1_000_000_000
        created_guests = 0
        for i in range(guest_count):
            g = Guests(
                created_at=random_date_within(180),
                fullName=fake.name(),
                email=fake.unique.email(),
                nationalID=next_national_id + i,
                nationality=fake.country(),
            )
            guest_objs.append(g)
            if len(guest_objs) >= chunk_size:
                Guests.objects.bulk_create(guest_objs)
                created_guests += len(guest_objs)
                guest_objs = []
                self.stdout.write(f"Created {created_guests} guests so far...")
        if guest_objs:
            Guests.objects.bulk_create(guest_objs)
            created_guests += len(guest_objs)
        guests_ids = list(Guests.objects.values_list("id", flat=True))
        self.stdout.write(self.style.SUCCESS(f"Total guests created: {created_guests}"))

        # Cabins (chunked)
        Cabins.objects.all().delete()
        cabin_objs = []
        created_cabins = 0
        for i in range(cabin_count):
            # adjust capacity to your model's validator (1..2). change if needed.
            max_capacity = random.choice([1, 2])
            regular_price = Decimal(str(round(random.uniform(50.0, 500.0), 2)))
            discount = Decimal(str(random.uniform(6, 18))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            c = Cabins(
                user=demo_user,
                created_at=random_date_within(300),
                name=f"Demo Cabin {i+1} {fake.word()}",
                maxCapacity=max_capacity,
                regularPrice=regular_price,
                discount=discount,
                observations=fake.sentence(nb_words=6),
            )
            cabin_objs.append(c)
            if len(cabin_objs) >= chunk_size:
                Cabins.objects.bulk_create(cabin_objs)
                created_cabins += len(cabin_objs)
                cabin_objs = []
                self.stdout.write(f"Created {created_cabins} cabins so far...")
        if cabin_objs:
            Cabins.objects.bulk_create(cabin_objs)
            created_cabins += len(cabin_objs)
        cabin_ids = list(Cabins.objects.values_list("id", flat=True))
        self.stdout.write(self.style.SUCCESS(f"Total cabins created: {created_cabins}"))

        # Bookings (chunked) — reference by IDs for speed
        Bookings.objects.all().delete()
        booking_objs = []
        created_bookings = 0
        for i in range(booking_count):
            # random pick IDs (no full object load)
            cabin_id = random.choice(cabin_ids)
            guest_id = random.choice(guests_ids)

            # fetch cabin price quickly (one db hit per chunk could be done instead; for simplicity below, we read cabin.regularPrice using cached dict)
            # To avoid many DB hits, build a small cache of cabin_id->price:
            # We'll build the cache on first use
            if i == 0:
                cabin_price_map = dict(Cabins.objects.in_bulk(cabin_ids))
                # convert model instances to price map
                cabin_price_map = {k: v.regularPrice for k, v in cabin_price_map.items()}

            num_nights = random.randint(1, 7)
            num_guests = random.randint(1, min(4, 2))  # adjust according to your model's maxCapacity
            cabin_price = cabin_price_map.get(cabin_id, Decimal("100.00"))
            extras_price = Decimal(str(round(random.uniform(0, 100), 2))) if random.random() < 0.4 else Decimal("0.00")
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
                status=random.choice(["checked-out", "checked-in", "unconfirmed"]),
                isPaid=random.choice([True, False]),
                observations=fake.sentence(nb_words=8),
                cabin_id=cabin_id,
                guest_id=guest_id,
            )
            booking_objs.append(b)

            if len(booking_objs) >= chunk_size:
                Bookings.objects.bulk_create(booking_objs)
                created_bookings += len(booking_objs)
                booking_objs = []
                self.stdout.write(f"Created {created_bookings} bookings so far...")
        if booking_objs:
            Bookings.objects.bulk_create(booking_objs)
            created_bookings += len(booking_objs)

        self.stdout.write(self.style.SUCCESS(f"Total bookings created: {created_bookings}"))
        self.stdout.write(self.style.SUCCESS("Demo population complete."))
