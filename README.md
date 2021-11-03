# small-ci

![main language](https://img.shields.io/github/languages/top/nerlihmax/small-ci)
![loc](https://img.shields.io/tokei/lines/github/nerlihmax/small-ci)

Простая cli-утилита с небольшим наборов скриптов для ci.

## Установка
`npm i -g small-ci`

## Использование
`small-ci <script_name>`

## Доступные скрипты
- ## release

| Параметр | Описание | Обязательный | ENV-алиас | Значение по умолчанию |
|:--------:|:--------:|:------------:|:---------:|:---------------------:|
| orgId | id организации в трекере | + | - | - |
| oauth | oauth2 ключ api | + | SCI_RELEASE_OAUTH | - |
| tagPattern | шаблон релизных тегов | - | - | v\*.\*.\* |
| queue | назавние очереди в трекере | + | - | - |

## Конфигурационный файл
`simple-ci.config.json`
### Пример
```
{
  "release": {
    "orgId": "6461097",
    "queue": "TMP"
  }
}
```