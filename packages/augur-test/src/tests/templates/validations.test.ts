import { ACCOUNTS, FlashSession, addScripts } from '@augurproject/tools';

let flash: FlashSession;

beforeAll(async () => {
  flash = new FlashSession(ACCOUNTS);
  addScripts(flash);
});

const templateValidations = [
  {
    title: 'Will h win the 2020 Arlington Million?',
    templateInfo:
      '{"hash":"0xb1e8150accfc1fb7e312342f9a45f333e7468dbdb39ca696501d221fc72a1675","question":"Will [0] win the [1] [2]?","inputs":[{"id":0,"value":"h","type":"TEXT","timestamp":"h"},{"id":1,"value":"2020","type":"DROPDOWN","timestamp":"2020"},{"id":2,"value":"Arlington Million","type":"DROPDOWN","timestamp":"Arlington Million"}]}',
    resolutionRules:
      "If the horse named in the market is scratched and does NOT run, including the cancellation of the race, or is disqualified for any reason, the market should resolve as 'No'.",
    endTime: '1575590500',
    result: 'success',
  },
  {
    title:
      'NHL (O/U): Anaheim Ducks vs. Arizona Coyotes: Total goals scored; Over/Under 4.5?',
    templateInfo:
      '{"hash":"0x652b787a2eed4ef1dc54739bdbcea162dfdd941e4b5dcaeaf7089dbddae37c78","question":"NHL (O/U): [0] vs. [1]: Total goals scored; Over/Under [2].5?","inputs":[{"id":0,"value":"Anaheim Ducks","type":"DROPDOWN","timestamp":"Anaheim Ducks"},{"id":1,"value":"Arizona Coyotes","type":"DROPDOWN","timestamp":"Arizona Coyotes"},{"id":2,"value":"4","type":"TEXT","timestamp":"4"},{"id":3,"value":"1575439200","type":"ESTDATETIME","timestamp":"1575439200"}]}',
    outcomes: 'Invalid,Over 4.5,Under 4.5,No Winner',
    resolutionRules:
      "If the game is not played market should resolve as 'No Winner'\nInclude Regulation, overtime and any shoot-outs\nThe game must go 55 minutes or more to be considered official if not, market should resolve as 'No winner'",
    endTime: '1575590500',
    result: 'success',
  },
  {
    title:
      'NFL (Point Spread): Arizona Cardinals to win by more than 2.5 points over Baltimore Ravens?',
    templateInfo:
      '{"hash":"0x01aaa1467af3642a9082da045bb3ccc45347cbc2e544171544998318ac917192","question":"NFL (Point Spread): [0] to win by more than [1].5 points over [2]?","inputs":[{"id":0,"value":"Arizona Cardinals","type":"DROPDOWN","timestamp":"Arizona Cardinals"},{"id":1,"value":"2","type":"TEXT","timestamp":"2"},{"id":2,"value":"Baltimore Ravens","type":"DROPDOWN","timestamp":"Baltimore Ravens"},{"id":3,"value":"1575504000","type":"ESTDATETIME","timestamp":"1575504000"}]}',
    outcomes: 'Invalid,Arizona Cardinals -2.5,Baltimore Ravens +2.5,No Winner',
    resolutionRules:
      "Include Regulation and Overtime\nAt least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No Winner'\nIf the game is not played market should resolve as 'No Winner'",
    endTime: '1575504001',
    result: 'success',
  },
  {
    title: 'NFL: Will the Arizona Cardinals win vs. the Atlanta Falcons?',
    templateInfo:
      '{"hash":"0xa5807ee39ca0820d64cfea3370d04ae94118dcfd902f6fe7bfa3234fc27f573c","question":"NFL: Will the [0] win vs. the [1]?","inputs":[{"id":0,"value":"Arizona Cardinals","type":"DROPDOWN","timestamp":"Arizona Cardinals"},{"id":1,"value":"Atlanta Falcons","type":"DROPDOWN","timestamp":"Atlanta Falcons"},{"id":2,"value":"1575590400","type":"ESTDATETIME","timestamp":"1575590400"}]}',
    resolutionRules:
      "Include Regulation and Overtime\nIf the game ends in a tie, the market should resolve as 'No' as Team A did NOT win vs. team B\nAt least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No'\nIf the game is not played market should resolve as 'No'",
    endTime: '1575590500',
    result: 'success',
  },
  {
    title:
      'NFL: Will the Arizona Cardinals & Atlanta Falcons win vs. the Atlanta Falcons?',
    templateInfo:
      '{"hash":"0xa5807ee39ca0820d64cfea3370d04ae94118dcfd902f6fe7bfa3234fc27f573c","question":"NFL: Will the [0] win vs. the [1]?","inputs":[{"id":0,"value":"Arizona Cardinals & Atlanta Falcons","type":"DROPDOWN","timestamp":"Arizona Cardinals"},{"id":1,"value":"Atlanta Falcons","type":"DROPDOWN","timestamp":"Atlanta Falcons"},{"id":2,"value":"1575590400","type":"ESTDATETIME","timestamp":"1575590400"}]}',
    resolutionRules:
      "Include Regulation and Overtime\nIf the game ends in a tie, the market should resolve as 'No' as Team A did NOT win vs. team B\nAt least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No'\nIf the game is not played market should resolve as 'No'",
    endTime: '1575590500',
    result: 'error: populated market question does not match regex',
  },
  {
    title:
      'NFL: Will the Arizona Cardinals Atlanta Falcons win vs. the Atlanta Falcons?',
    templateInfo:
      '{"hash":"0xa5807ee39ca0820d64cfea3370d04ae94118dcfd902f6fe7bfa3234fc27f573c","question":"NFL: Will the [0] win vs. the [1]?","inputs":[{"id":0,"value":"Arizona Cardinals Atlanta Falcons","type":"DROPDOWN","timestamp":"Arizona Cardinals"},{"id":1,"value":"Atlanta Falcons","type":"DROPDOWN","timestamp":"Atlanta Falcons"},{"id":2,"value":"1575590400","type":"ESTDATETIME","timestamp":"1575590400"}]}',
    resolutionRules:
      "Include Regulation and Overtime\nIf the game ends in a tie, the market should resolve as 'No' as Team A did NOT win vs. team B\nAt least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No'\nIf the game is not played market should resolve as 'No'",
    endTime: '1575590500',
    result: 'error: populated market question does not match regex',
  },
  {
    title:
      'NFL: Will the Arizona Cardinals|Atlanta Falcons win vs. the Atlanta Falcons?',
    templateInfo:
      '{"hash":"0xa5807ee39ca0820d64cfea3370d04ae94118dcfd902f6fe7bfa3234fc27f573c","question":"NFL: Will the [0] win vs. the [1]?","inputs":[{"id":0,"value":"Arizona Cardinals|Atlanta Falcons","type":"DROPDOWN","timestamp":"Arizona Cardinals"},{"id":1,"value":"Atlanta Falcons","type":"DROPDOWN","timestamp":"Atlanta Falcons"},{"id":2,"value":"1575590400","type":"ESTDATETIME","timestamp":"1575590400"}]}',
    resolutionRules:
      "Include Regulation and Overtime\nIf the game ends in a tie, the market should resolve as 'No' as Team A did NOT win vs. team B\nAt least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No'\nIf the game is not played market should resolve as 'No'",
    endTime: '1575590500',
    result: 'error: populated market question does not match regex',
  },
  {
    title:
      'Will the price of BTC/USD, exceed 4 anytime between the open of December 24, 2019 and close of December 31, 2019, according to TradingView.com "BTCUSD (crypto - Bitfinex)"?',
    templateInfo:
      '{"hash":"0x1c802c546d2be89d137907ba63f11f908f47eb85044ba11dc25b5b95d5d78824","question":"Will the price of [0], exceed [1] anytime between the open of [2] and close of [3], according to TradingView.com [4]?","inputs":[{"id":0,"value":"BTC/USD","type":"DROPDOWN_QUESTION_DEP","timestamp":null},{"id":1,"value":"4","type":"TEXT","timestamp":null},{"id":2,"value":"December 24, 2019","type":"DATESTART","timestamp":1576281600},{"id":3,"value":"December 31, 2019","type":"DATEYEAR","timestamp":null},{"id":4,"value":"BTCUSD (crypto - Bitfinex)","type":"DROPDOWN","timestamp":null}]}',
    endTime: '1576281600',
    resolutionRules:
      "Opening date and time is determined by the opening price of the market trading pair on tradingview.com.\nIf the trading pair market isn't available on tradingview.com, refer to the actual exchange. For example, if Coinbase's tradingview.com data feed is down, you must find the opening price on Coinbase's exchange by using the hourly candle. If you are not in the timezone UTC-0, you must ensure that you are looking at the equivilant of 00:00 UTC-0 on the hourly at the date specified in the market question.",
    result: 'error: populated title does not match title given',
  },
  {
    title: 'Will the CAC 40 close on or above 5200 on December 31, 2019?',
    templateInfo:
      '{"hash":"0x7c631efb5047c650e6afab2b7793caef8d28c6eb0adcf2710497a05f4acbad8d","question":"Will the [0] close on or above [1] on [2]?","inputs":[{"id":0,"value":"CAC 40","type":"DROPDOWN","timestamp":"CAC 40"},{"id":1,"value":"5200","type":"TEXT","timestamp":"5200"},{"id":2,"value":"December 31, 2019","type":"DATEYEAR","timestamp":"1577772000"}]}',
    endTime: '1575763200',
    resolutionRules:
      'Closing date is determine by the location of the exchange, where the underlying stocks for the index are traded',
    result: 'error: no validation found for hash',
  },
  {
    title: 'Will the BSE Sensex 30 close on or above 33 on December 29, 2019?',
    templateInfo:
      '{"hash":"0x8e75eae3e5e343e447bc2bddd9e3bb949c2d7bc9f935ab42a293250a36d4b32a","question":"Will the [0] close on or above [1] on [2]?","inputs":[{"id":0,"value":"BSE Sensex 30","type":"DROPDOWN","timestamp":null},{"id":1,"value":"33","type":"TEXT","timestamp":null},{"id":2,"value":"December 29, 2019","type":"DATEYEAR","timestamp":1577645591}]}',
    endTime: '1578281600',
    resolutionRules:
      'Closing date is determined by the location of the exchange, where the underlying stocks for the index are traded\nIf trading day in market question is a weekend or holiday when exchange is not open this market should resolve as invalid',
    result: 'error: market question date can not be on weekend or on a holiday',
  },
  {
    title: 'Will the BSE Sensex 30 close on or above 33 on December 29, 2019?',
    templateInfo:
      '{"hash":"0x8e75eae3e5e343e447bc2bddd9e3bb949c2d7bc9f935ab42a293250a36d4b32a","question":"Will the [0] close on or above [1] on [2]?","inputs":[{"id":0,"value":"BSE Sensex 30","type":"DROPDOWN","timestamp":null},{"id":1,"value":"33","type":"TEXT","timestamp":null},{"id":2,"value":"December 29, 2019","type":"DATEYEAR","timestamp":1577645591}]}',
    endTime: '1578281600',
    resolutionRules:
      'Closing date is determined by the location of the exchange, where the underlying stocks for the index are traded\nIf trading day in market question is a weekend or holiday when exchange is not open this market should resolve as invalid',
    result: 'error: market question date can not be on weekend or on a holiday',
  },
  {
    title: 'Will the BSE Sensex 30 close on or above 33 on January 20, 2020?',
    templateInfo:
      '{"hash":"0x8e75eae3e5e343e447bc2bddd9e3bb949c2d7bc9f935ab42a293250a36d4b32a","question":"Will the [0] close on or above [1] on [2]?","inputs":[{"id":0,"value":"BSE Sensex 30","type":"DROPDOWN","timestamp":null},{"id":1,"value":"33","type":"TEXT","timestamp":null},{"id":2,"value":"January 20, 2020","type":"DATEYEAR","timestamp":1579478400}]}',
    endTime: '1580404439',
    resolutionRules:
      'Closing date is determined by the location of the exchange, where the underlying stocks for the index are traded\nIf trading day in market question is a weekend or holiday when exchange is not open this market should resolve as invalid',
    result: 'error: market question date can not be on weekend or on a holiday',
  },
  {
    title:
      'Will the BSE Sensex 30 close on or above 33.00.01 on December 31, 2019?',
    templateInfo:
      '{"hash":"0x0002f8d51971eb501b583aa57e705e98ea7f2033ed07d89f4703d5738ebf829e","question":"Will the [0] close on or above [1] on [2]?","inputs":[{"id":0,"value":"BSE Sensex 30","type":"DROPDOWN","timestamp":null},{"id":1,"value":"33.00.01","type":"TEXT","timestamp":null},{"id":2,"value":"December 31, 2019","type":"DATEYEAR","timestamp":1577772000}]}',
    endTime: '1578581600',
    resolutionRules:
      'Closing date is determined by the location of the exchange, where the underlying stocks for the index are traded\nIf trading day in market question is a weekend or holiday when exchange is not open this market should resolve as invalid',
    result: 'error: populated market question does not match regex',
  },
  {
    title: 'Will the Russell 1000 close on or above 14 on January 2, 2020?',
    templateInfo:
      '{"hash":"0x0002f8d51971eb501b583aa57e705e98ea7f2033ed07d89f4703d5738ebf829e","question":"Will the [0] close on or above [1] on [2]?","inputs":[{"id":0,"value":"Russell 1000","type":"DROPDOWN","timestamp":null},{"id":1,"value":"14","type":"TEXT","timestamp":null},{"id":2,"value":"January 2, 2020","type":"DATEYEAR","timestamp":1577944800}]}',
    endTime: '1578198860',
    resolutionRules:
      'Closing date is determined by the location of the exchange, where the underlying stocks for the index are traded\nIf trading day in market question is a weekend or holiday when exchange is not open this market should resolve as invalid',
    result: 'success',
  },
  {
    title: 'Will the Russell 1000 close on or above 14 on January 2, 2020?',
    templateInfo:
      '{"hash":"0x0002f8d51971eb501b583aa57e705e98ea7f2033ed07d89f4703d5738ebf829e","question":"Will the [0] close on or above [1] on [2]?","inputs":[{"id":0,"value":"Russell 1000","type":"DROPDOWN","timestamp":null},{"id":1,"value":"14","type":"TEXT","timestamp":null},{"id":2,"value":"January 2, 2020","type":"DATEYEAR","timestamp":1577944800}]}',
    endTime: '1577988860',
    resolutionRules:
      'Closing date is determined by the location of the exchange, where the underlying stocks for the index are traded\nIf trading day in market question is a weekend or holiday when exchange is not open this market should resolve as invalid',
    result: 'error: event expiration can not be before exchange close time',
  },];

test('flash :: tempalte validation tests', async () => {
  templateValidations.map(async t => {
    const result = await flash.call('validate-template', t);
    await expect(result).toEqual(t.result);
  });
});
