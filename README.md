# small-ci

![npm](https://img.shields.io/npm/v/small-ci)
![main language](https://img.shields.io/github/languages/top/nerlihmax/small-ci)
![loc](https://img.shields.io/tokei/lines/github/nerlihmax/small-ci)

Простая cli-утилита с небольшим наборов скриптов для ci.

## Установка
`npm i -g small-ci`

## Использование
`small-ci <script_name>`

## Доступные скрипты
- ## tracker - создает по текущему тегу ишью на трекере

| Параметр | Описание | Обязательный | ENV-алиас | Значение по умолчанию |
|:--------:|:--------:|:------------:|:---------:|:---------------------:|
| orgId | id организации в трекере | + | - | - |
| oauth | oauth2 ключ api | + | SCI_TRACKER_OAUTH | - |
| tagPattern | шаблон релизных тегов | - | - | v\*.\*.\* |
| queue | назавние очереди в трекере | + | - | - |

  ## tracker --comment='comment text' - отправляет коммент к ишью на трекере

- ## docker - создает докер image

## Конфигурационный файл
`simple-ci.config.json`
### Пример
```
{
  "tracker": {
    "orgId": "6461097",
    "queue": "TMP"
  }
}
```
