import feedparser as fd
import adb
from hashlib import sha512
import re

# 회원가입
def signupFn(data):
    INFO = {
        "id": data.get('id', '').strip(),
        "name": data.get('name', '').strip(),
        "phone": ''.join(re.findall("\d+", data.get('phone', '').strip()))
    }
    pwd1 = data.get('pwd1', '').strip()
    pwd2 = data.get('pwd2', '').strip()
    if pwd1 != pwd2:
        return False, "비밀번호를 확인해주세요."
    elif not INFO['id']:
        return False, "ID를 입력해주세요."
    elif not INFO['name']:
        return False, "이름을 입력해주세요."
    elif not INFO['phone'] or len(INFO) > 11:
        return False, "이동전화번호를 입력해주세요."
    db = adb.Adb()
    try:
        db.execute("SELECT COUNT(*) FROM user WHERE `id`=%(id)s", {"id": INFO['id']})
        cnt = db.fetchone()[0]
        if cnt:
            return False, "중복된 아이디입니다."
        INFO['pwd'] = sha512(pwd1.encode('utf-8')).hexdigest()
        sql = """
        INSERT INTO user (`id`, `pwd`, `name`, `phone`)
        VALUES (%(id)s, %(pwd)s, %(name)s, %(phone)s)
        """
        db.execute(sql, INFO)
        db.commit()
        return True, "가입되었습니다."
    except Exception as e:
        return False, "signUp E"
    finally:
        db.close()

# 로그인
def loginFn(data):
    INFO = {
        "id": data.get('id', ''),
        "pwd": sha512(data.get('pwd', '').encode('utf-8')).hexdigest()
    }
    db = adb.Adb()
    try:
        db.execute("SELECT COUNT(*) FROM user WHERE `id`=%(id)s AND `pwd`=%(pwd)s", INFO)
        rs = db.fetchone()[0]
        return (True, INFO['id']) if rs else (False, "없는 계정입니다.")
    except:
        return False, "LOGIN E"
    finally:
        db.close()


def city_list():
    db = adb.Adb()
    try:
        db.execute("SELECT * FROM weather_table;")
        return db.fetchall_dict()
    except:
        return []
    finally:
        db.close()


def rss_view(code, select):
    db, res = adb.Adb(), ''
    try:
        db.execute("SELECT `url` FROM weather_table WHERE `code`=%(code)s;", {"code": code})
        rs = db.fetchone()
        data = fd.parse(rs[0])
        if select == "list":
            location = data.entries[0].content[0].value.split('</location>')
            res = [
                {
                    "city": loc.split('<city>')[1].split('</city>')[0],
                    "data": [
                        {
                            "time":d.split('<tmef>')[1].split('</tmef>')[0],
                            "text": d.split('<wf>')[1].split('</wf>')[0],
                            "min": d.split('<tmn>')[1].split('</tmn>')[0],
                            "max": d.split('<tmx>')[1].split('</tmx>')[0]
                        } for d in loc.split('<data>')[1:]
                    ]
                }
                for loc in location[:-1]
            ]
        elif select == "all":
            ents = data.entries[0]
            date = ents['title'].split('-')[-1]
            res = ents['wf']
        return True, res
    except Exception as e:
        return False, repr(e)
    finally:
        db.close()
        