const axios = require('axios');

const getDollar = async (crypto) => {
  try {
    crypto = 'BTC'
    const coinbaseApiUrl = `https://api.coinbase.com/v2/prices/${crypto}-usd/spot`;
    const response = await axios.get(coinbaseApiUrl, {
      headers: {
        'CB-VERSION': '2015-04-08',
      },
    });

    const apiResponse = response.data;
    //console.log('Coinbase API Response:', apiResponse.data.amount);

    const amount = Number(apiResponse.data.amount).toFixed(2);

    return `${amount}$`;
  } catch (error) {
    console.error('Error calling Coinbase API:', error);
  }
}
module.exports.getDollar = getDollar;

const getEuro = async (crypto) => {
  try {
    crypto = 'BTC'
    const coinbaseApiUrl = `https://api.coinbase.com/v2/prices/${crypto}-eur/spot`;
    const response = await axios.get(coinbaseApiUrl, {
      headers: {
        'CB-VERSION': '2015-04-08',
      },
    });

    const apiResponse = response.data;
    //console.log('Coinbase API Response:', apiResponse.data.amount);

    const amount = Number(apiResponse.data.amount).toFixed(2);

    if (amount > 2000) {
      var returnValue = `${amount}€`;
    }
    return returnValue;
  } catch (error) {
    console.error('Error calling Coinbase API:', error);
  }
};

module.exports.getEuro = getEuro;