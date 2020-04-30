import time
from flask import Flask, jsonify, request
import service

app = Flask(__name__)
# app.config['SECRET_KEY'] = 'ljh.com'

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/login', methods=["POST"])
def login():
    data = request.json
    res, msg = service.loginFn(data)
    if res:
        return jsonify(result=True, id=msg, msg="로그인되었습니다.")
    else:
        return jsonify(result=False, msg=msg)

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    res, msg = service.signupFn(data)
    return jsonify(result=res, msg=msg)


@app.route('/weather', methods=["POST"])
def weather():
    data = request.json
    method = data.get("method", '')
    select = data.get("select", '')
    if method == "city_list":
        return jsonify(result=True, list=service.city_list())
    elif method == "weather_data":
        code = data.get('code', 0)
        if not data or not code or not code.isdecimal() or 10 < int(code) or int(code) < 0:
            return jsonify(result=False, msg="No Data")
        try:
            chk, data = service.rss_view(code, select)
            return jsonify(result=chk, data=data, sel=select)
        except Exception as e:
            return jsonify(result=False, msg=repr(e))
    else:
        return jsonify(result=False, msg="No Method")

@app.route("/naver_now_rank", methods=["POST"])
def naver_now_rank():
    if request.json.get("method", '') == "rank":
        from urllib.request import urlopen
        import json
        try:
            with urlopen('https://www.naver.com/srchrank') as res:
                body = res.read()

            data = json.loads(body.decode())['data']
            return jsonify(result=True, list=data)
        except Exception as e:
            return jsonify(result=False, msg=repr(e))


if __name__ == "__main__":
    app.run()