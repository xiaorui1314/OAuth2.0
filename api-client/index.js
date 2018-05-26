/**
 * 简单API客户端模拟获取AccessToken的过程
 *
 * 
 */

const parseUrl = require('url').parse;
const formatUrl = require('url').format;
const axios = require('axios')

const { addParamsToUrl } = require('../lib/utils')


// 定义请求API的地址
const API_URL = 'http://localhost:3000';
const API_OAUTH2_AUTHORIZE = API_URL + '/OAuth2/authorize';
const API_OAUTH2_ACCESS_TOKEN = API_URL + '/OAuth2/access_token';


function APIClient(options) {
  this._appKey = options.appKey;
  this._appSecret = options.appSecret;
  this._callbackUrl = options.callbackUrl;
}

// 生成获取授权的跳转地址
APIClient.prototype.getRedirectUrl = function () {
  return addParamsToUrl(API_OAUTH2_AUTHORIZE, {
    client_id: this._appKey,
    redirect_url: this._callbackUrl
  });
};


// 获取access_token
APIClient.prototype.requestAccessToken = async function (code) {
  const res = await axios.post(`${API_OAUTH2_ACCESS_TOKEN}`, {
    code: code,
    client_id: this._appKey,
    client_secret: this._appSecret,
    redirect_url: this._callbackUrl
  })
  if (res.data.status === 'OK') {
    this._accessToken = res.data.result.access_token
    return Promise.resolve(res.data.result)
  }
};


module.exports = APIClient;
