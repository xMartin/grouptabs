define([
	'pouchdb'
], function (PouchDB) {
	"use strict";

	return {

		db: null,

		tabId: '',

		init: function (tabId) {
			this.tabId = tabId;
			this.db = new PouchDB('grouptabs-' + tabId);
		},

		sync: function () {
			var tabId = this.tabId;
			this._syncHandle = this.db.sync(
				'https://xmartin.iriscouch.com:6984/grouptabs',
				{
					live: true,
					filter: function (doc) {
						return doc.document_type === 'tab' && doc._id === tabId || doc.document_type === 'transaction' && doc.tabId === tabId;
					}
				}
			)
			.on('error', function (err) {
				console.error(err);
			});
		},

		stopSyncing: function () {
			this._syncHandle.cancel();
		},

		getTransactions: function () {
			return new Promise(function (resolve, reject) {
				function mapFun (doc) {
					if (doc.document_type === 'transaction') {
						emit(doc._id, null);
					}
				}
				this.db.query(mapFun, {include_docs: true}, function (err, response) {
					if (err) {
						reject(err);
					}

					var transactions = [];
					response.rows.forEach(function (row) {
						transactions.push(row.doc);
					});

					resolve(transactions);
				});
			}.bind(this));
		},

		getParticipants: function () {
			return new Promise(function (resolve, reject) {
				this.getTransactions()
				.then(function (transactions) {
					var participants = {};
					transactions.forEach(function (transaction) {
						var total = 0;
						transaction.participants.forEach(function (participant) {
							total += participant.amount || 0;
						});
						var share = total / transaction.participants.length;
						transaction.participants.forEach(function (participant) {
							var amount = participant.amount || 0;
							var participantName = participant.participant;
							var storedAmount = participants[participantName] || 0;
							var newAmount = storedAmount - share + amount;
							participants[participantName] = newAmount;
						});
					});
					var result = [];
					for (var participant in participants) {
						var resultObj = {};
						resultObj.participant = participant;
						resultObj.amount = participants[participant];
						result.push(resultObj);
					}
					result.sort(function (a, b) {
						return a.amount < b.amount ? -1 : 1
					});
					resolve(result);
				})
				.catch(function (err) {
					reject(err);
				});
			}.bind(this));
		},

		saveTransaction: function (doc) {
			doc.document_type = 'transaction';
			doc.tabId = this.tabId;
			if (doc._id) {
				this.db.put(doc, function (err, response) {
					console.log(err, response);
				});
			} else {
				this.db.post(doc, function (err, response) {
					console.log(err, response);
				});
			}
		},

		removeTransaction: function (doc) {
			doc._deleted = true;
			this.db.put(doc, function (err, response) {
				console.log(err, response);
			});
		},

		setupChangesListener: function (listener) {
			this.db.info(function (err, info) {
				if (err) {
					console.error(err);
					return;
				}
				this.db.changes({
					since: info.update_seq,
					live: true
				}).on('change', listener);
			}.bind(this));
		}

	};

});
