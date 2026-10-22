-- Example Annonser. Run through the postgres MCP server after db/schema.sql, on an empty table.

INSERT INTO annonser (tittel, beskrivelse, byttes_mot, nisse, gard, opprettet) VALUES
  ('Smørklatt fra julegrøten', 'En god smørklatt, spart fra grøten på julaften. Litt smeltet i kanten, men ellers som ny.', 'En varm lue', 'Tulla', 'Øvre Li', now() - interval '2 hours'),
  ('Rød nisselue, lite brukt', 'Strikket av bestemor i 1887. Har et lite hull der katten bet, ellers fin.', 'Tre smørklatter', 'Gubben', 'Nordre Bakken', now() - interval '1 day'),
  ('Høyball til vinteren', 'Tørr og god høyball, perfekt å sove i. Lukter sommer.', 'Ei bøtte melk', 'Vesla', 'Haugen', now() - interval '2 days'),
  ('Lykt med stearinlys', 'Gammel lykt som lyser opp fjøset om natta. Lyset er halvbrent.', 'Grøt for en uke', 'Rasmus', 'Sørli', now() - interval '3 days'),
  ('Tresko i liten størrelse', 'Et par tresko som er blitt for små. Passer en ung nisse.', 'Ullsokker', 'Mor Nisse', 'Øvre Li', now() - interval '5 days'),
  ('Kattepels til å sove på', 'Pels som katten mistet i vår. Myk og varm, men lukter litt katt.', 'Et godt råd om rotter', 'Tobias', 'Nedre Myra', now() - interval '8 days');
