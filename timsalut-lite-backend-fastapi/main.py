from fastapi import FastAPI, Response, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Union
import httpx
import random


###########################################################################################
#                                          CONFIGS                                        #
###########################################################################################
APP_URL = "REDACTED"

###########################################################################################
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    name: str
    pwd: str

class ListRequest(BaseModel):
    id_reg: str

SessionToken = ""
SessionRanmorData = {}

###########################################################################################
#                                           AUTH                                          #
###########################################################################################
@app.post("/auth/login")
async def fetch_cookies(response: Response, login_data: LoginRequest):
    url = APP_URL + "login"
    
    form_data = {
        "name": login_data.name,
        "pwd": login_data.pwd
    }
    
    async with httpx.AsyncClient() as client:
        try:
            fetchResponse = await client.post(
                url,
                data=form_data,
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            if fetchResponse.status_code != 200:
                return {
                    "s": fetchResponse.status_code,
                    "m": fetchResponse.text
                }
            fetchResponse_data = fetchResponse.json()
            cookies = dict(fetchResponse.cookies)
            if "ci_session" in cookies and int(fetchResponse_data["code"]) if "code" in fetchResponse_data else None == 200:
                global SessionToken
                SessionToken = cookies["ci_session"]

            return {
                "s": int(fetchResponse_data["code"]) if "code" in fetchResponse_data else None,
                "m": fetchResponse_data["msg"] if "msg" in fetchResponse_data else None,
                "t": cookies["ci_session"] if "ci_session" in cookies else None
            }
            
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Error communicating with API: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.get("/auth/logout")
async def fetch_cookies():
    global SessionToken
    SessionToken = ""

@app.get("/auth/userData")
async def fetch_userData():
    global SessionToken
    if not SessionToken:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    url = APP_URL + "api/userData"
    
    cookies = {
        "ci_session": SessionToken
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-requested-with": "XMLHttpRequest"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            fetchResponse = await client.get(
                url,
                cookies=cookies,
                headers=headers
            )
            if fetchResponse.status_code != 200:
                return {
                    "s": fetchResponse.status_code,
                    "m": fetchResponse.text
                }
            return {
                "s": fetchResponse.status_code,
                "d": fetchResponse.json()
            }
            
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Error communicating with API: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

###########################################################################################
#                                          POLISI                                         #
###########################################################################################
@app.post("/polisi/pendaftaran/list")
async def polisi_pendaftaran_get_list_data(list_request: ListRequest):
    global SessionToken
    print(SessionToken)
    
    # Check if user is logged in
    if not SessionToken:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    url = APP_URL + "listdaftar"
    
    # Prepare form data and headers
    form_data = {
        "id_reg": list_request.id_reg
    }
    
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-requested-with": "XMLHttpRequest"
    }

    cookies = {
        "ci_session": SessionToken
    }
    
    async with httpx.AsyncClient() as client:
        try:
            fetchResponse = await client.post(
                url,
                data=form_data,
                headers=headers,
                cookies=cookies
            )
            
            if fetchResponse.status_code != 200:
                return {
                    "s": fetchResponse.status_code,
                    "m": fetchResponse.text
                }
            return {
                "s": fetchResponse.status_code,
                "d": fetchResponse.json()
            }
            
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Error communicating with API: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")


class ListRequestPolisiPendaftaranSearchRanmor(BaseModel):
    wtnkb: str
    np1: str
    np2: str
    np3: str

@app.post("/polisi/pendaftaran/searchRanmor")
async def polisi_pendaftaran_search_ranmor(list_request: ListRequestPolisiPendaftaranSearchRanmor):
    global SessionToken
    
    # Check if user is logged in
    if not SessionToken:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    url = APP_URL + "ranmor_reg"

    nopolInput = list_request.wtnkb + " " + list_request.np1 + " " + list_request.np2 + " " + list_request.np3
    
    # Prepare form data and headers
    form_data = {
        "np1"   : list_request.np1,
        "np2"   : list_request.np2,
        "np3"   : list_request.np3,
        "wtnkb" : list_request.wtnkb
    }
    
    headers = {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest"
    }

    cookies = {
        "ci_session": SessionToken
    }
    
    async with httpx.AsyncClient() as client:
        try:
            fetchResponse = await client.post(
                url,
                data=form_data,
                headers=headers,
                cookies=cookies
            )

            if fetchResponse.status_code != 200:
                return {
                    "s": fetchResponse.status_code,
                    "m": fetchResponse.text
                }
            
            if "vehicle_data" not in fetchResponse.json():
                return {
                    "s": 404,
                    "m": "Data not found"
                }

            fetchResponseJSON = fetchResponse.json()
            vehicle_data = fetchResponseJSON["vehicle_data"]
            stat = 0
            if "message2" in fetchResponseJSON:
                if("Ranmor ini wajib memperpanjang STNK. Masa berlaku STNK hanya sampai dengan tanggal" in fetchResponseJSON["message2"]):
                    stat = 2
                elif("" == fetchResponseJSON["message2"] or "OK" == fetchResponseJSON["message2"]):
                    stat = 1
                else:
                    stat = 3

            data = {
                "k": vehicle_data["nik"] if "nik" in vehicle_data else None,
                "n": vehicle_data["nama"] if "nama" in vehicle_data else None,
                "a": vehicle_data["alamat"] if "alamat" in vehicle_data else None,
                "j": vehicle_data["jenis_kb"] if "jenis_kb" in vehicle_data else None,
                "m": vehicle_data["merk_kb"] if "merk_kb" in vehicle_data else None,
                "t": vehicle_data["type_kb"] if "type_kb" in vehicle_data else None,
                "w": vehicle_data["warna_kb"] if "warna_kb" in vehicle_data else None,
                "b": vehicle_data["thn_buat"] if "thn_buat" in vehicle_data else None,
                "mil": vehicle_data["milikke"] if "milikke" in vehicle_data else None,
                "sta": stat,
                # "msg": fetchResponseJSON["message2"] if "message2" in fetchResponseJSON else None
            }

            SessionRanmorData[nopolInput] = {
                **data,
                "input1": vehicle_data["input1"] if "input1" in vehicle_data else None,
            }
            print(SessionRanmorData)
            return {
                "s": fetchResponse.status_code,
                "d": data
            }
            
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Error communicating with API: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
        
class ListRequestPolisiPendaftaranAdd(BaseModel):
    wtnkb: str
    np1: str
    np2: str
    np3: str
    id_lay: int

@app.post("/polisi/pendaftaran/add")
async def polisi_pendaftaran_add(response: Response, list_request: ListRequestPolisiPendaftaranAdd):
    global SessionToken
    
    # Check if user is logged in
    if not SessionToken:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    url = APP_URL + "didaftar"

    if(list_request.wtnkb + " " + list_request.np1 + " " + list_request.np2 + " " + list_request.np3 not in SessionRanmorData):
        response.status_code = status.HTTP_404_NOT_FOUND
        return {
            "s": 404,
            "m": "Data ranmor not found"
        }
    
    # Prepare form data and headers
    form_data = {
        "input1": SessionRanmorData[list_request.wtnkb + " " + list_request.np1 + " " + list_request.np2 + " " + list_request.np3]["input1"],
        "id_lay": list_request.id_lay,
        "no_antri": random.randint(5000, 6000)
    }
    
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",        
        "x-requested-with": "XMLHttpRequest"
    }

    cookies = {
        "ci_session": SessionToken
    }
    
    async with httpx.AsyncClient() as client:
        try:
            fetchResponse = await client.post(
                url,
                data=form_data,
                headers=headers,
                cookies=cookies
            )
            if fetchResponse.status_code != 200:
                return {
                    "s": fetchResponse.status_code,
                    "m": fetchResponse.text
                }
            
            # fetchResponseJSON = fetchResponse.json()
            # if fetchResponseJSON["code"] == 200:
            #     SessionRanmorData[list_request.wtnkb + " " + list_request.np1 + " " + list_request.np2 + " " + list_request.np3]["id_reg"] = fetchResponseJSON["obyek"]
            #     print(SessionRanmorData)
            #     return {
            #         "s": fetchResponse.status_code,
            #         # "m": fetchResponseJSON["msg"]
            #     }
            # else:
            return {
                "s": fetchResponse.status_code,
                "d": fetchResponse.json()
            }
            
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Error communicating with API: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")



###########################################################################################
#                                         ONLINE                                          #
###########################################################################################

class ListRequestOnlineSearchRanmor(BaseModel):
    wtnkb: str
    np1: str
    np2: str
    np3: str

@app.post("/online/searchRanmor")
async def online_search_ranmor(list_request: ListRequestOnlineSearchRanmor):

    url = "http://172.55.71.200/bpdws/info_pajak_mode2"
    
    # Prepare form data and headers
    form_data = {
        "wtnkb": list_request.wtnkb,
        "np1": list_request.np1,
        "np2": list_request.np2,
        "np3": list_request.np3,
        "ws_id": "tax_calc",
        "ws_ps": "Derrpa#$ulutH3B4t2023"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            fetchResponse = await client.post(
                url,
                data=form_data
            )
            if fetchResponse.status_code != 200:
                return {
                    "s": fetchResponse.status_code,
                    "m": fetchResponse.text
                }
            
            fetchResponseJSON = fetchResponse.json()["itemkb"][0] if "itemkb" in fetchResponse.json() else None
            if fetchResponseJSON == None or "plat" not in fetchResponseJSON:
                return {
                    "s": 404,
                    "m": "Data not found"
                }
            if int(fetchResponseJSON["code"]) != 200:
                return {
                    "s": int(fetchResponseJSON["code"]),
                    "m": fetchResponseJSON["message"]
                }
            return {
                "s": int(fetchResponseJSON["code"]),
                "np": str(fetchResponseJSON["plat"][:1]) + " / " + str(fetchResponseJSON["nopol"]),
                "n": fetchResponseJSON["nama"],
                "a": fetchResponseJSON["alamat"],
                "j": fetchResponseJSON["jenis"],
                "m": fetchResponseJSON["merek"],
                "t": fetchResponseJSON["tipe"],
                "w": fetchResponseJSON["warna"],
                "b": fetchResponseJSON["thn_buat"],
                "nm": fetchResponseJSON["no_mesin"],
                "nr": fetchResponseJSON["no_rangka"],
                "mil": fetchResponseJSON["milik_ke"],
                "jtst": fetchResponseJSON["tgl_berlaku"], #Jatuh Tempo STNK
                "jtpj": fetchResponseJSON["jt_saat_pn"], #Jatuh Tempo Pajak
                "jtbr": fetchResponseJSON["jt_berikut"], #Jatuh Tempo Berikutnya
                "pkb": fetchResponseJSON["ttlpkb"], #PKB
                "pkbd": fetchResponseJSON["denda"], #PKB Denda
                "sw": fetchResponseJSON["ttlswdkllj"], #SWDKLLJ
                "swd": fetchResponseJSON["dendasw"], #SWDKLLJ Denda
                "jml": fetchResponseJSON["jumlah"], #Total
                "tht": fetchResponseJSON["thn_tagihan"], #Tahun Tertagih
                "cbp": True if fetchResponseJSON["can_be_paid"] == 1 else False, #Can be paid
            }
            return fetchResponse.json()
            
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Error communicating with API: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
        

class ListRequestOnlineTap(BaseModel):
    wtnkb: str
    np1: str
    np2: str
    np3: str
    noka: str

@app.post("/online/tap")
async def online_search_ranmor(list_request: ListRequestOnlineTap):

    url = "http://172.55.71.200/bpdws/penetapan_esamsat"
    
    # Prepare form data and headers
    form_data = {
        "wtnkb": list_request.wtnkb,
        "np1": list_request.np1,
        "np2": list_request.np2,
        "np3": list_request.np3,
        "norangka": list_request.noka,
        "midl": 123456789,
        "ws_id": "tax_calc",
        "ws_ps": "Derrpa#$ulutH3B4t2023"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            fetchResponse = await client.post(
                url,
                data=form_data
            )
            if fetchResponse.status_code != 200:
                return {
                    "s": fetchResponse.status_code,
                    "m": fetchResponse.text
                }
            
            fetchResponseJSON = fetchResponse.json()["itemkb"][0]
            fetchResponseJSON = fetchResponse.json()["itemkb"][0] if "itemkb" in fetchResponse.json() else None
            if fetchResponseJSON == None:
                return {
                    "s": 404,
                    "m": "Data not found"
                }
            if int(fetchResponseJSON["code"]) != 200:
                return {
                    "s": int(fetchResponseJSON["code"]),
                    "m": fetchResponseJSON["message"]
                }
            return {
                "s": fetchResponseJSON["code"],
                "kb": fetchResponseJSON["kodebayar"],
                "ex": fetchResponseJSON["expiredate"]
            }
            return fetchResponseJSON
            
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Error communicating with API: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")


class ListRequestSearchCetak(BaseModel):
    kdbill: str

@app.post("/online/searchCetak")
async def online_search_ranmor(list_request: ListRequestSearchCetak):

    # Check if user is logged in
    if not SessionToken:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    url = APP_URL + "dataeprintkdbill"
    
    # Prepare form data and headers
    form_data = {
        "kdbill"   : list_request.kdbill,
    }
    
    headers = {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest"
    }

    cookies = {
        "ci_session": SessionToken
    }

    async with httpx.AsyncClient() as client:
        try:
            fetchResponse = await client.post(
                url,
                data=form_data,
                headers=headers,
                cookies=cookies
            )
            if fetchResponse.status_code != 200:
                return {
                    "s": fetchResponse.status_code,
                    "m": fetchResponse.text
                }
            fetchResponse_data = fetchResponse.json()
            if "code" in fetchResponse_data and int(fetchResponse_data["code"]) != 200:
                raise HTTPException(status_code=500, detail=fetchResponse_data["msg"])

            return {
                "s": int(fetchResponse_data["code"]) if "code" in fetchResponse_data else 200, 
                "np": fetchResponse_data["nopol"] if "nopol" in fetchResponse_data else None, #Nomor Polisi
                "n": fetchResponse_data["nama"] if "nama" in fetchResponse_data else None, #Nama
                "a": fetchResponse_data["alamat"] if "alamat" in fetchResponse_data else None, #Alamat
                "j": fetchResponse_data["jenis_kb"] if "jenis_kb" in fetchResponse_data else None, #Jenis
                "m": fetchResponse_data["merk_kb"] if "merk_kb" in fetchResponse_data else None, #Merk
                "t": fetchResponse_data["type_kb"] if "type_kb" in fetchResponse_data else None, #Tipe
                "w": fetchResponse_data["warna_kb"] if "warna_kb" in fetchResponse_data else None, #Warna
                "pkb": fetchResponse_data["pkb"] if "pkb" in fetchResponse_data else None, #PKB
                "pkbd": fetchResponse_data["pkb_den"] if "pkb_den" in fetchResponse_data else None, #PKB Denda
                "sw": fetchResponse_data["swd"] if "swd" in fetchResponse_data else None, #SWDKLLJ
                "swd": fetchResponse_data["swd_den"] if "swd_den" in fetchResponse_data else None, #SWDKLLJ Denda
                "top": fetchResponse_data["total_pokok"] if "total_pokok" in fetchResponse_data else None, #Total PKB dan SWD (Pokok)
                "tod": fetchResponse_data["total_den"] if "total_den" in fetchResponse_data else None, #Total PKB dan SWD (Denda)
                "tot": fetchResponse_data["total"] if "total" in fetchResponse_data else None, #Total PKB dan SWD (Total)
            }
            # return fetchResponse_data
            
        except httpx.RequestError as e:
            # raise HTTPException(status_code=500, detail=f"Error communicating with API: {str(e)}")
            return {
                    "s": 500,
                    "m": f"Error communicating with API: {str(e)}"
                }
        except Exception as e:
            # raise HTTPException(status_code=500, detail=f"{str(e)}")
            return {
                    "s": 500,
                    "m": f"{str(e)}"
                }