export default {
  rows() {
    const rows = AttendanceTransform.rows();
    const map = {};

    rows.forEach(r => {
      const b = r.branch || "Nezařazeno";
      if (!map[b]) {
        map[b] = { branch: b, count: 0 };
      }
      map[b].count++;
    });

    const order = [
      "Obchodní oddělení",
			"Prodejna Praha",
      "Sklad Praha",
      "Brno",
			"Plzeň",
      "Pardubice",
      "Tábor",
      "Vyškov"      
    ];

    return order
      .filter(b => map[b])
      .map(b => map[b]);
  }
}
