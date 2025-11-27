from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    
    page_size = 20
    page_size_query_param = "pagesize"
    max_page_size = 25
    page_query_param = "pagenumber"
