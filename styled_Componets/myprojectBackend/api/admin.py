from django.contrib import admin

# Register your models here.
from django.contrib import admin

# Register your models here.
from django.contrib import admin
from api.models import Cabins, Guests, Bookings, Settings

# Register your models here.
# Register your models here.
admin.site.site_header = "Wild OASIS"
admin.site.site_title = "Book Your Stay Where you are Strange "
admin.site.index_title = "Manage your Bookings at our Platform"

models = [Cabins, Guests, Bookings, Settings]

#     list_display = ('title', 'amount', 'date', 'category')
#     list_filter = ('category', 'date')
#     search_fields = ('title', 'category')
#     date_hierarchy = 'date'
#     ordering = ('-date',)

# class BudgetAdmin(admin.ModelAdmin):
#     list_display = ('category', 'amount', 'period')
#     list_filter = ('period',)
#     search_fields = ('category',)

# class IncomeAdmin(admin.ModelAdmin):
#     list_display = ('source', 'amount', 'date')
#     list_filter = ('date',)
#     search_fields = ('source',)
#     date_hierarchy = 'date'
#     ordering = ('-date',)

# admin.site.register(ExpenseModel, ExpenseModelAdmin)
# admin.site.register(Budget, BudgetAdmin)
# admin.site.register(Income, IncomeAdmin)
for model in models:
    if model not in admin.site._registry:
        admin.site.register(model)
