# def validate_positive(value):
#     """Reusable check: value must be > 0."""
#     if value is None or value <= 0:
#         raise serializers.ValidationError("Value must be greater than zero.")


# def validate_alpha_space(value):
#     """Reusable check: only letters and spaces allowed (good for nationality / names)."""
#     alpha_space = RegexValidator(r"^[A-Za-z\s]+$")
#     try:
#         alpha_space(value)
#     except Exception:
#         raise serializers.ValidationError(
#             "This field may only contain letters and spaces."
#         )


# def validate_image_file(value):
#     """
#     Production-level image validation for countryFlag field:
#     1. Ensures file is actually an image (not just renamed file).
#     2. Accepts only JPEG and PNG formats.
#     3. Limits file size to 2MB.
#     """
#     # Check size
#     max_size = 2 * 1024 * 1024  # 2 MB
#     if hasattr(value, "size") and value.size > max_size:
#         raise serializers.ValidationError("Image must be smaller than 2MB.")

#     # Check content and format
#     try:
#         img = Image.open(value)
#         img.verify()  # verify that it is a valid image
#     except Exception:
#         raise serializers.ValidationError("Uploaded file is not a valid image.")

#     if img.format.upper() not in ["JPEG", "PNG"]:
#         raise serializers.ValidationError("Only JPEG and PNG images are allowed.")

#     return value
