# descending_order_fields=['name_asc','regularPrice_low','minCapacity_Cabins']
# value=[f.split('_')[0] for f in descending_order_fields]

# print(value)
params = "name-as"
# params = "regularPrice-low-asc"

# mapping_dict = {
#     "asc": {
#         "name-asc": "name",
#         "regularPrice-low-asc": "regularPrice",
#         "minCapacityCabins-asx": "minCapacity",
#     },
#     "des": {
#         "name-desc": "name",
#         "regularPrice-max-desc": "regularPrice",
#         "maxCapacityCabin-desc": "minCapacity",
#     },
# }

# order = params.split("-")[-1]

# field = mapping_dict.get(order, "N/A").get(params, "N/A")
# print(field)

# params: str = self.request.query_params
allowed_queryparams = [
    "name-asc",
    "regularPrice-low-asc",
    "minCapacityCabins-asc",
    "name-desc",
    "regularPrice-max-desc",
    "maxCapacityCabin-desc",
]

if params not in allowed_queryparams:
    print ( "query parameters must be correct")