from flask import Flask, request
import argostranslate.package
import argostranslate.translate

from_code = "ru"
to_code = "en"

# Download and install Argos Translate package
argostranslate.package.update_package_index()
available_packages = argostranslate.package.get_available_packages()
package_to_install = next(
    filter(
        lambda x: x.from_code == from_code and x.to_code == to_code, available_packages
    )
)
argostranslate.package.install_from_path(package_to_install.download())

# Translate
translatedText = argostranslate.translate.translate(
    "Hello World", from_code, to_code)
print(translatedText)


app = Flask(__name__)


@app.post("/translate")
def translate():
    requestBody = request.get_json()
    to = requestBody['to']
    fromLng = requestBody['from']
    text = requestBody['text']

    translatedText = argostranslate.translate.translate(text, fromLng, to)

    return {'translation': translatedText}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7878)
