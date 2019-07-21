## AUREA

In Greek mythology, the Ourea (Ancient Greek: Oὔρεα "mountains," plural of Oὖρος) were progeny of Gaia, members of the Greek primordial deities, who were the first-born elemental gods and goddesses. According to Hesiod:

- run dev database

```sh
docker run -d --name dev-mongo \
-e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root-sample-db \
-e MONGO_INITDB_DATABASE=ourea_db -v /Users/lennon/recent/ourea/volume/data:/data/db \
-p 27017:27017 mongo
```
