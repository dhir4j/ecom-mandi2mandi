#!C:\Python27\python.exe
 
import cgi
import cgitb
cgitb.enable()

# HEADERS
print("Content-Type:text/html; charset=UTF-8")


# CONTENT
print("<html><body>")
print("Content")
print("</body></html>")

form = cgi.FieldStorage()
print(form["firstname"])