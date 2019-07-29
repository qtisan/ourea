## AUREA

In Greek mythology, the Ourea (Ancient Greek: Oὔρεα "mountains," plural of Oὖρος) were progeny of Gaia, members of the Greek primordial deities, who were the first-born elemental gods and goddesses. According to Hesiod:

- run dev database

```sh
docker run -d --name dev-mongo \
-e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root-sample-db \
-e MONGO_INITDB_DATABASE=ourea_db -v /Users/lennon/recent/ourea/volume/data:/data/db \
-p 27017:27017 mongo
```

### highlight the todos embedded.

- use the 2 vscode plugins: `todo+`, `highlight`.

* / / NOTE: this is a note sample.
* / / FIXME: this is a fixme sample.
* / / OPTIMIZE: this is a optimize sample.
* / / TODO: this is a todo sample.
* / / FUTURE: this is a future sample.
* / / REVIEW: this is a review sample.
* / / TODAY: this is a today sample.
* / / IDEA: this is a idea sample.
* / / HACK: this is a hack sample.
* / / DEBUG: this is a debug sample.

* code:

```json
  // settings.json in vscode.
 "todo.embedded.regex": "(?:<!-- *)?(?:#|//|/\\*+|<!--|--|\\* @|\\{!|\\{\\{!--|\\{\\{!) *(TODO|FIXME|TODAY|FUTURE|HACK|NOTE|IDEA|REVIEW|DEBUG|OPTIMIZE)(?:\\s*\\([^)]+\\))?:?(?!\\w)(?: *-->| *\\*/| *!}| *--}}| *}}|(?= *(?:[^:]//|/\\*+|<!--|@|--|\\{!|\\{\\{!--|\\{\\{!))|((?: +[^\\n@]*?)(?= *(?:[^:]//|/\\*+|<!--|@|--(?!>)|\\{!|\\{\\{!--|\\{\\{!))|(?: +[^@\\n]+)?))",
  "highlight.regexes": {
    "(// ?TODO:?)(.*)": [
      {
        "backgroundColor": "#ffcc00",
        "color": "#1f1f1f",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#111",
        "color": "#ffcc00"
      }
    ],
    "(// ?FIXME:?)(.*)": [
      {
        "backgroundColor": "#ff0000",
        "color": "#1f1f1f",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#111",
        "color": "#ff0000"
      }
    ],
    "(// ?TODAY:?)(.*)": [
      {
        "backgroundColor": "#39c",
        "color": "#1f1f1f",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#111",
        "color": "#39c"
      }
    ],
    "(// ?FUTURE:?)(.*)": [
      {
        "backgroundColor": "#55aa33",
        "color": "#000",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#111",
        "color": "#55aa33"
      }
    ],
    "(// ?HACK:?)(.*)": [
      {
        "backgroundColor": "#96d",
        "color": "#000",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#111",
        "color": "#96d"
      }
    ],
    "(// ?NOTE:?)(.*)": [
      {
        "backgroundColor": "#89a",
        "color": "#000",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#111",
        "color": "#89a"
      }
    ],
    "(// ?REVIEW:?)(.*)": [
      {
        "backgroundColor": "#3cc",
        "color": "#000",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#111",
        "color": "#3cc"
      }
    ],
    "(// ?DEBUG:?)(.*)": [
      {
        "backgroundColor": "#c69",
        "color": "#000",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#111",
        "color": "#c69"
      }
    ],
    "(// ?OPTIMIZE:?)(.*)": [
      {
        "backgroundColor": "#f93",
        "color": "#000",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#111",
        "color": "#f93"
      }
    ],
    "(// ?IDEA:?)(.*)": [
      {
        "backgroundColor": "#89f",
        "color": "#000",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#111",
        "color": "#89f"
      }
    ],
    "(///\\s+<)(reference)(\\s+\\w+)(=\")([^\\n~\\r]+)(\"\\s+/>)": [
      {
        "color": "#6c6"
      },
      {
        "color": "#66c"
      },
      {
        "color": "#6cc"
      },
      {
        "color": "#6c6"
      },
      {
        "color": "#c66"
      },
      {
        "color": "#6c6"
      }
    ]
  }
```
