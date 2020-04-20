import time
from flask import Flask, jsonify, request, render_template, redirect

import feedparser as fd

app = Flask(__name__)

@app.route('/')
def index():
    return redirect('/')

@app.route('/weather', methods=["POST"])
def weather():
    data = request.json
    method = data.get("method", '')
    if method == "city_list":
        return jsonify(result=True, list=city_list())
    elif method == "weather_data":
        code = data.get('code', 0)
        if not data or not code or not code.isdecimal() or 10 < int(code) or int(code) < 0:
            return jsonify(result=False, msg="No Data")
        
        chk, msg = rss_view(code)
        return jsonify(result=chk, msg=msg)


def city_list():
    return [
        {"name": "전국", "code": 1},
        {"name": "서울/경기도", "code": 2},
        {"name": "강원도", "code": 3},
        {"name": "충청북도", "code": 4},
        {"name": "충청남도", "code": 5},
        {"name": "전라북도", "code": 6},
        {"name": "전라남도", "code": 7},
        {"name": "경삭북도", "code": 8},
        {"name": "경삭남도", "code": 9},
        {"name": "제주도", "code": 10}
    ]

def rss_view(code):
    weather_data = {
        '1': "http://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=108", # 전국
        '2': "https://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=108", # 서울/경기도
        '3': "http://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=105", # 강원도
        '4': "http://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=131", # 충청북도
        '5': "http://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=133", # 충청남도
        '6': "http://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=146", # 전라북도
        '7': "http://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=156", # 전라남도
        '8': "http://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=143", # 경상북도
        '9': "http://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=159", # 경상남도
        '10': "http://www.kma.go.kr/weather/forecast/mid-term-rss3.jsp?stnId=184" # 제주도
    }
    try:
        data = fd.parse(weather_data[code])
        ents = data.entries[0]
        date = ents['title'].split('-')[-1]
        coments = ents['wf']
        return True, coments
    except Exception as e:
        return False, repr(e)


if __name__ == "__main__":
    app.run(debug=True)