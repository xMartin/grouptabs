define([
	'dojo/request/xhr',
	'pouchdb'
], function (xhr, PouchDB) {
	"use strict";

	return {

		db: null,
		tabId: '',
		dbName: '',

		init: function (tabId) {
			this.tabId = tabId;
			this.dbName = 'tab/' + tabId;
			this.hoodie = new Hoodie(config.backendUrl);
			return this._setupDb();
		},

		_setupDb: function () {
			return new Promise(function (resolve) {
				this.db = new PouchDB(this.dbName);
				this.db.put({
					_id: '_design/document_type',
					views: {
						document_type: {
							map: function (doc) {
								emit(doc.document_type);
							}.toString()
						}
					},
					filters: {
						transaction: function (doc) {
							return doc.document_type === 'transaction';
						}.toString()
					}
				}).then(function () {
					console.log('db: view "document_type" created.');
					resolve();
				}).catch(function (err) {
					if (err.name === 'conflict') {
						console.log('db: view "document_type" exists.');
						resolve();
					} else {
						throw new Error(err);
					}
				});
			}.bind(this));
		},

		sync: function () {
			this.hoodie.createDb({name: this.dbName, write: true})
			.then(
				this._sync.bind(this),
				function (err) {
					throw new Error(err);
				}.bind(this)
			);
		},

		_sync: function () {
			var url = config.backendUrl + '/_api/' + encodeURIComponent(this.dbName);
			this._syncHandle = this.db.sync(url, {live: true})
			.on('error', function (err) {
				console.error(err);
			});
		},

		stopSyncing: function () {
			this._syncHandle.cancel();
		},

		getTransactions: function () {
			return new Promise(function (resolve, reject) {
				this.db.query(
					'document_type',
					{key: 'transaction', include_docs: true},
					function (err, response) {
						if (err) {
							reject(err);
						}

						var transactions = [];
						response.rows.forEach(function (row) {
							transactions.push(row.doc);
						});

						resolve(transactions);
					}
				);
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
					filter: 'document_type/transaction',
					live: true
				}).on('change', listener);
			}.bind(this));
		}

	};

});
