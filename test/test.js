const expect = require('chai').expect,
    newsService = require('../app/services/NewsService'),
    User = require('../app/models/userModel.js'),
    config = 'API.key',
    NewsAPI = require('newsapi'),
    newsapi = new NewsAPI(config),
    sinon = require('sinon');
require('chai').use(require('sinon-chai'));


describe('The NewsService module', function () {

    it('should get the response status ok', function () {
        let req = {headers: {token: '123', title: 'Top'}};
        let user = {Country: 'ua', Categories: 'sport'};
        let expectToken = {'Token': '123'};
        let expectOptions = { status: "ok", articles: [1, 2, 3]};
        let callbackspy = sinon.spy();

        let userStub = sinon.stub(User, 'findOne')
        userStub.withArgs(expectToken).yields(null, user);
        userStub.withArgs().throws("TypeError");


        let newsapiStub = sinon.stub(newsapi, 'v2').yields() => {
            newsapiStub.returns({
                status: "ok",
                articles: [1, 2, 3]
            })
        });


        newsService.getNews(req, callbackspy);

        //expect(userStub.calledWith({'Token': '123'})).to.be.ok;
        expect(userStub).to.have.been.calledOnce;
        // expect(newsapiStub).to.be.calledWith(wer);
        // expect(newsapiStub).to.not.throw();
        // expect(result).to.be.an('object');
        // expect(result).to.have.all.keys('status', 'articles');
        // expect(result).to.equal({status: "ok", poi: [1, 2, 3]});
        //{code: 200, response: response}
    })
});