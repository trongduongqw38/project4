let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

var host = "https://msboqjjyed.execute-api.us-east-1.amazonaws.com/dev";
var token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlMycWFFbk5oZlZ2ZDVKdENkZml1YiJ9.eyJpc3MiOiJodHRwczovL2Rldi1oeHZxdGtteHJyczEzNTZuLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExMjI3OTQ3OTc4MDA0NTU4NjcxMiIsImF1ZCI6ImtQcGpGM3hxa2RITHBUMUtpTjE4TDNuaHJENDI3NDhXIiwiaWF0IjoxNjY5NjQ4NDkwLCJleHAiOjE2Njk2ODQ0OTAsImF0X2hhc2giOiJiVXgtNWZQUWZJOHpBV0ZUdkFqTmtBIiwic2lkIjoiVjh0V3d5Mm1adGNqTTdkVGJYMXQ1djJkbUJqekx2VHMiLCJub25jZSI6InFvVkZJdm5WTl9zSlpISVZtUnZYQVIxdUUuYklKTGdRIn0.5ZUaicC-0uyh5tBsVLOcLaY7479jxM5izt3JExMiqcQP3bEGzCqVnD8RfNegKI7LTqw87yE8SupXYAL1X2gvR7nu2OYGCNZv9JBNLnVUHNh_0YNSxYbcULRpIOsjqxXkB6M-rvF7OOgyPK6OMg57-0T-rIqU3_GkkTlWrf7uyLo5QiP-cTbf6kxpBGwXAE1ix_Ek-8Z8LUCgUx3imveNugzl1ABMlLdSn2N8knMKi4GSKK2SLAZ4K6shg4q2ssmG4q51n8oI69k2PXOR9NBWSpr1cy1IDBGzVmZEMBmK4joY6T7HwkDX8YoZ0VRXM79Emk8uYAUQJpa9pTEqCzcDsw"

chai.use(chaiHttp);
//Our parent block
describe('GET Todo', () => {
    beforeEach((done) => {
        //Before each test we empty the database in your case
        done();
    });
    /*
     * Test the /GET route
     */
    describe('/GET TodosAccess', () => {
        it('it should GET all the TodosAccess', (done) => {
            chai.request(host)
                .get('/todos')
				.set("Authorization", "Bearer " + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('items').that.is.an('array');
                    done();
                });
        });
    });
});

describe('/POST Todo', () => {
        it('it should POST a todos', (done) => {
            let todo = {
                name: "Water flowers",
                dueDate: "2019-06-11"
            };
            chai.request(host)
                .post('/todos')
				.set("Authorization", "Bearer " + token)
                .send(todo)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });


describe('/DELETE/:id Todo', () => {
        it('it should DELETE a Todo given the id', (done) => {
            // TODO add a model to db then get that id to take this test
            let id = 'fe671583-4512-45f6-9475-4265c04362fb';
            chai.request(host)
                .delete('/todos/' + id)
				.set("Authorization", "Bearer " + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
	
	
describe('/GET attachment url/:id/attachment', () => {
        it('it should GET attachment url given the id', (done) => {
            // TODO add a model to db then get that id to take this test
            let id = '09a46cc0-daaa-44d1-98d2-60636a111c2d';
            chai.request(host)
                .post('/todos/' + id + '/attachment')
				.set("Authorization", "Bearer " + token)
                .end((err, res) => {
                    res.should.have.status(201);
					res.body.should.be.a('object');
					res.body.should.have.property('uploadUrl').that.is.an('string');
                    done();
                });
        });
    });
	
describe('/UPDATE/:id Todo', () => {
        it('it should UPDATE a todo', (done) => {
			let id = '09a46cc0-daaa-44d1-98d2-60636a111c2d'
            let todo = {
                name: "Duong",
                dueDate: "2019-06-11",
				done: true
            };
            chai.request(host)
                .patch('/todos/' + id)
				.set("Authorization", "Bearer " + token)
                .send(todo)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });