(async () => {
    const chai = await import('chai');
    const chaiHttp = await import('chai-http');
    const app = (await import('../../index')).default; 

    const { expect } = chai;
    chai.use(chaiHttp);

    describe('User Integration Test', () => {
        it('should create a new user and retrieve the details', (done) => {
            const user = {
                email: 'ian1@mail.com',
                password: '123456',
            };

            chai.request(app)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('email').eql('ian1@mail.com');
                    done();
                });
        });
    });
})();
