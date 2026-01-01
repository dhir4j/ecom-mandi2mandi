#!/usr/bin/env python3.9
import cgi
import binascii
import json
import hashlib
import base64
import zlib
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
from Crypto.Util.Padding import unpad
from Crypto import Random


class Functions:
    @staticmethod
    def decrypt_string(encrypted_data, username, password):
        secret_key = hashlib.md5((username + "~:~" + password).encode()).hexdigest()
        iv = encrypted_data[:16]
        encrypted_data = encrypted_data[16:]

        # Decrypt the data using AES-CBC with the given IV and secret key
        cipher = AES.new(secret_key.encode(), AES.MODE_CBC, iv.encode())
        decrypted_data = cipher.decrypt(base64.b64decode(encrypted_data))

        # Remove padding from the decrypted data
        unpadded_data = unpad(decrypted_data, AES.block_size)

        return unpadded_data.decode()


# Set the content type
print("Content-type: text/html\n")

form = cgi.FieldStorage()

required_fields = ['response']
error_msg=""

mercid = ''
username = ''
password = ''
secret =''
client_id = ''
client_secret = ''
token_url='https://kraken.airpay.co.in/airpay/pay/v4/api/oauth2/token.php'
url='https://payments.airpay.co.in/pay/v4/index.php'


if 'response' not in form or not form['response'].value:
    error_msg = "Response is empty."
else:
    try:

       secret_key = hashlib.md5((username + "~:~" + password).encode()).hexdigest()
       response_data = form['response'].value
       decrypted_data = Functions.decrypt_string(response_data, username, password)
       data_dict = json.loads(decrypted_data)
       data = data_dict.get('data', {})
       TRANSACTIONID = data.get('orderid', '').strip()
       APTRANSACTIONID = data.get('ap_transactionid', '').strip()
       AMOUNT = data.get('amount', '').strip()
       TRANSACTIONSTATUS = data.get('transaction_status', '').strip()
       MESSAGE = data.get('message', '').strip()
       ap_SecureHash = str(data.get('ap_securehash', '')).strip()
       CHMOD = ""
       CUSTOMVAR = ""
       AP_SECUREHASH_data = TRANSACTIONID + ':' + APTRANSACTIONID + ':' + AMOUNT + ':' + TRANSACTIONSTATUS + ':' + MESSAGE + ':' + mercid + ':' + username
       if 'chmod' in data:
          # If exists, assign its trimmed value to CHMOD
           CHMOD = data['chmod'].strip()
       if 'custom_var' in data:
          # If exists, assign its trimmed value to CUSTOMVAR
           CUSTOMVAR = data['custom_var'].strip()
       CUSTOMERVPA = ""
       if CHMOD.lower() == "upi":
       # Assuming POST data is available in a dictionary named post_data
           if "CUSTOMERVPA" in data:
               CUSTOMERVPA = ":" + data["CUSTOMERVPA"].strip()

       if error_msg:
           print('<table><font color="red"><b>ERROR:</b> {}</font></table>'.format(error_msg))


       hash_string = f"{TRANSACTIONID}:{APTRANSACTIONID}:{AMOUNT}:{TRANSACTIONSTATUS}:{MESSAGE}:{mercid}:{username}{CUSTOMERVPA}"

# Calculating the CRC32 hash
       merchant_secure_hash = zlib.crc32(hash_string.encode())

# Converting to unsigned integer
       merchant_secure_hash = merchant_secure_hash & 0xffffffff


       print("<!DOCTYPE html>")
       print("<html>")
       print("<head>")
       print("<meta charset=\"utf-8\">")
       print("<title>Airpay Payment Gateway</title>")
       print("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">")
       print("<meta name=\"description\" content=\"\">")
       print("<meta name=\"author\" content=\"\">")
       print("<link href=\"https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,600&family=Roboto:wght@300;400;700&display=swap\" rel=\"stylesheet\">")
       print("<link type=\"text/css\" rel=\"stylesheet\" href=\"style.css\">")
       print("<style>")
       print("table {")
       print("  border-collapse: collapse;")
       print("  width: 50%;")
       print("}")
       print("th, td {")
       print("  text-align: left;")
       print("  padding: 8px;")
       print("}")
       print(".tdfail{")
       print("    color:red;")
       print("}")
       print(".tdsuccess{")
       print("    color:green;")
       print("}")
       print("</style>")
       print("</head>")
       print("<body>")
       print("<div class=\"wrapper\">")
       print("    <div class=\"contentbody\">")
       print("        <div class=\"lside\">")
       print("            <div class=\"lsidewrap\">")
       print("                <div class=\"logo\"><img src=\"airpay-text-wh.svg\"></div>")
       print("                <div class=\"coverimg\"><img src=\"coverimg.png\"></div>")
       print("            </div>")
       print("        </div>")
       print("        <div class=\"rside\">")
       print("            <div class=\"formwrap container-fluid\">")
       if TRANSACTIONSTATUS == '200':
           print('<table style="color:green;"><tr><td colspan="2" style="color: green; font-size: 20px; padding: 8px;" class="tdsuccess"><b>SUCCESS TRANSACTION</b></td></tr></table>')
       else:
           print('<table style="color:red;"><tr><td colspan="2" style="color: red; font-size: 20px; padding: 8px;" class="tdfail"><b>FAILED TRANSACTION</b></td></tr></table>')
       print('<table style="border-collapse: collapse; width: 50%;">')
       print('<tr><td style="text-align: left; padding: 8px; margin-right: 10px; font-size: 17px;"><b>Variable Name</b></td><td style="text-align: left; padding: 8px; margin-right: 10px; font-size: 17px;"><b>Value</b></td></tr>')
       print('<tr><td style="text-align: left; padding: 8px; font-size: 17px;">TRANSACTIONID:</td><td style="text-align: left; padding: 8px; font-size: 17px;"> ' + str(TRANSACTIONID) + '</td></tr>')
       print('<tr><td style="text-align: left; padding: 8px; font-size: 17px;">APTRANSACTIONID:</td><td style="text-align: left; padding: 8px; font-size: 17px;"> ' + str(APTRANSACTIONID) + '</td></tr>')
       print('<tr><td style="text-align: left; padding: 8px; font-size: 17px;">AMOUNT:</td><td style="text-align: left; padding: 8px; font-size: 17px;"> ' + str(AMOUNT) + '</td></tr>')
       print('<tr><td style="text-align: left; padding: 8px; font-size: 17px;">TRANSACTIONSTATUS:</td><td style="text-align: left; padding: 8px; font-size: 17px;"> ' + str(TRANSACTIONSTATUS) + '</td></tr>')
       print('<tr><td style="text-align: left; padding: 8px; font-size: 17px;">MESSAGE:</td><td style="text-align: left; padding: 8px; font-size: 17px;"> ' + str(MESSAGE) + '</td></tr>')
       print('<tr><td style="text-align: left; padding: 8px; font-size: 17px;">CUSTOMVAR:</td><td style="text-align: left; padding: 8px; font-size: 17px;"> ' + str(CUSTOMVAR) + '</td></tr>')
       print('</table>')
       print("            </div>")
       print("        </div>")
       print("    </div>")
       print("</div>")
       print("</body>")
       print("</html>")
 

    except Exception as e:
        error_msg = "Error: {}".format(str(e))
    # Print error message if exists
    if error_msg:
        print('<table><font color="red"><b>ERROR:</b> {}</font></table>'.format(error_msg))       
