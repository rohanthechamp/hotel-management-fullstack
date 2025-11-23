# from cryptography.hazmat.primitives.asymmetric import ec
# from cryptography.hazmat.primitives import serialization
# from cryptography.hazmat.backends import default_backend


# # 1. Generate the Private Key (This will be your SIGNING_KEY)
# private_key = ec.generate_private_key(
#     public_exponent=65537, key_size=2048, backend=default_backend()
# )

# # Serialize the Private Key to PEM format (as bytes)
# # This key is secret and used to sign the JWT.
# # ! should not be shared ever ,musts keep on backend
# SIGNING_KEY_PEM = private_key.private_bytes(
#     encoding=serialization.Encoding.PEM,
#     format=serialization.PrivateFormat.PKCS8,
#     # Use a password in production for better security
#     encryption_algorithm=serialization.NoEncryption(),
# ).decode("utf-8")


# # 2. Extract the Public Key (This will be your VERIFYING_KEY)
# public_key = private_key.public_key()
# # *Safe to share anywhere (frontend, mobile apps, partner services)
# # Serialize the Public Key to PEM format (as bytes)
# # This key is public and used to verify the JWT signature.
# VERIFYING_KEY_PEM = public_key.public_bytes(
#     encoding=serialization.Encoding.PEM,
#     format=serialization.PublicFormat.SubjectPublicKeyInfo,
# ).decode("utf-8")
