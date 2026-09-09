export default {
	transform() {
		const agregace = AgregaceSklady.data;
		const mapa = MapPobocky.data;

		// Mapa: sklad → pobočka
		const skladToPobocka = {};
		for (const row of mapa) {
			skladToPobocka[row.sklad] = row.pobocka;
		}

		// Agregace po pobočkách
		const agregacePobocky = {};

		for (const row of agregace) {
			const pobocka = skladToPobocka[row.sklad] || "Neznámá pobočka";

			if (!agregacePobocky[pobocka]) {
				agregacePobocky[pobocka] = {
					pobocka,
					pocet_skladu: 0,
					pocet_prevodek_open: 0,
					nejstarsi_datum: row.nejstarsi_datum,
					pocet_unikatnich_produktu: 0,
					median_datum: row.median_datum,
					median_hours: row.median_hours
				};
			}

			const agg = agregacePobocky[pobocka];
			agg.pocet_skladu += 1;
			agg.pocet_prevodek_open += row.pocet_prevodek_open;
			agg.pocet_unikatnich_produktu += row.pocet_unikatnich_produktu;

			if (new Date(row.nejstarsi_datum) < new Date(agg.nejstarsi_datum)) {
				agg.nejstarsi_datum = row.nejstarsi_datum;
			}

			if (new Date(row.median_datum) < new Date(agg.median_datum)) {
				agg.median_datum = row.median_datum;
				agg.median_hours = row.median_hours;
			}
		}

		// ✅ LOGUJEME NEZNÁMÉ SKLADY
		const neznameSklady = agregace
			.map(row => row.sklad)
			.filter(sklad => !(sklad in skladToPobocka));

		console.log("Neznámé sklady:", neznameSklady);

		return Object.values(agregacePobocky);
	},

	getSkladyForPobocka(pobocka) {
		const mapa = MapPobocky.data;
		const agregace = AgregaceSklady.data;

		// najdi všechny sklady dané pobočky
		const sklady = mapa
			.filter(row => row.pobocka === pobocka)
			.map(row => row.sklad);

		// najdi odpovídající řádky z agregace
		return agregace
			.filter(row => sklady.includes(row.sklad))
			.map(row => ({
				Name: row.sklad,
				pocet_prevodek_open: row.pocet_prevodek_open,
				nejstarsi_datum: row.nejstarsi_datum,
				median_hours: row.median_hours
			}));
	}
};