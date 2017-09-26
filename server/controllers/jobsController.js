const Job = require('../models').Job;
const Employer = require('../models').Employer;
const Applicants = require('../models').Applicants;

module.exports = {
	create(req, res) {
		"use strict";
		return Job
			.create({
				title: req.body.title,
				description: req.body.description,
				employerId: req.body.employerId.id
			})
			.then((job) => {
				console.log(job);
				res.status(201).send({
					job
				});
			})
			.catch((error) => res.status(400).send(error))
	},

	list(req, res) {
		"use strict";
		console.log("job listed");
		return Job
			.findAll({
				include: [Employer]
			})
			.then((jobs) => {
			console.log("the jobs are:", jobs);
				res.status(201).send(jobs);
			})
			.catch((error) => res.status(201).send(error));
	},

	getById(req, res) {
		"use strict";
		console.log("inside looking for id:", req.params.jobId);
		return Job
			.findById(req.params.jobId, {
				include: [{
					model: Employer
				}]
			})
			.then((job) => {
				job.Employer.getJobs()
					.then(employerJobs => {
						console.log('the jobs within:', employerJobs);
						console.log("we found a job!!:", job.dataValues);
						job.dataValues.Employer.dataValues.jobs = employerJobs;
						res.status(201).send({
							job: job.dataValues
						});
					})

			})
			.catch((error) => res.status(401).send(error));
	}
};

