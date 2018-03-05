const expect = require('chai').expect,
    newsService = require('../app/services/NewsService'),
    User = require('../app/models/userModel.js'),
    NewsAPI = require('newsapi'),
    newsapi = new NewsAPI('27c459eea11f4adc852261ed2f4cb121'),
    sinon = require('sinon');
require('chai').use(require('sinon-chai'));


describe('The NewsService module', function () {

    let req = {headers: {token: '123', title: 'Top'}};
    let user = {Country: 'ua', Categories: 'sport'};
    let expectToken = {'Token': '123'};
    //let expectOptions = {status: "ok", articles: [1, 2, 3]};
    let response = {status: "ok", articles: [1, 2, 3]};
    let callbackspy = sinon.spy();


    let userStub = sinon.stub(User, 'findOne');
    userStub.withArgs(expectToken).yields(null, user);
    userStub.withArgs().throws("TypeError");

    let newsStab = sinon.mock(newsapi.v2, 'topHeadlines')
    newsStab
    it('should pass params and call userStab once', function (done) {

        newsStab.expects('topHeadlines').once();
        newsService.getNews(req, callbackspy);
        newsStab.verify();
        newsStab.restore();

        expect(userStub).to.have.been.calledOnce;
      // expect(newsStab).to.have.been.calledOnce;
        done()
    });
    // it ('should pass params and call newsStab once', function (done) {
    //
    //     newsService.getNews(req, callbackspy);
    //     done()
    // })
});