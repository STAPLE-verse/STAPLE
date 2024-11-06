export function getDateLanguageLocales() {
  const localesList = [
    {
      id: "af",
      iso_639_2: "afr",
      name: "Afrikaans locale",
      language: "Afrikaans",
    },
    {
      id: "ar-DZ",
      iso_639_2: "ara",
      name: "Arabic locale (Algerian Arabic)",
      language: "Algerian Arabic",
    },
    {
      id: "ar-MA",
      iso_639_2: "ara",
      name: "Arabic locale (Moroccan Arabic)",
      language: "Moroccan Arabic",
    },
    {
      id: "ar-SA",
      iso_639_2: "ara",
      name: "Arabic locale (Saudi Arabic)",
      language: "Arabic",
    },
    {
      id: "ar-TN",
      iso_639_2: "ara",
      name: "Arabic locale (Tunisian Arabic)",
      language: "Arabic",
    },
    {
      id: "az",
      iso_639_2: "aze",
      name: "Azerbaijani locale",
      language: "Azerbaijani",
    },
    {
      id: "be",
      iso_639_2: "bel",
      name: "Belarusian locale",
      language: "Belarusian",
    },
    {
      id: "bg",
      iso_639_2: "bul",
      name: "Bulgarian locale",
      language: "Bulgarian",
    },
    {
      id: "bn",
      iso_639_2: "ben",
      name: "Bengali locale",
      language: "Bengali",
    },
    {
      id: "bs",
      iso_639_2: "bos",
      name: "Bosnian locale",
      language: "Bosnian",
    },
    {
      id: "ca",
      iso_639_2: "cat",
      name: "Catalan locale",
      language: "Catalan",
    },
    {
      id: "cs",
      iso_639_2: "ces",
      name: "Czech locale",
      language: "Czech",
    },
    {
      id: "cy",
      iso_639_2: "cym",
      name: "Welsh locale",
      language: "Welsh",
    },
    {
      id: "da",
      iso_639_2: "dan",
      name: "Danish locale",
      language: "Danish",
    },
    {
      id: "de",
      iso_639_2: "deu",
      name: "German locale",
      language: "German",
    },
    {
      id: "de-AT",
      iso_639_2: "deu",
      name: "German locale (Austria)",
      language: "German",
    },
    {
      id: "el",
      iso_639_2: "ell",
      name: "Greek locale",
      language: "Greek",
    },
    {
      id: "en-AU",
      iso_639_2: "eng",
      name: "English locale (Australia)",
      language: "English",
    },
    {
      id: "en-CA",
      iso_639_2: "eng",
      name: "English locale (Canada)",
      language: "English",
    },
    {
      id: "en-GB",
      iso_639_2: "eng",
      name: "English locale (United Kingdom)",
      language: "English",
    },
    {
      id: "en-IN",
      iso_639_2: "eng",
      name: "English locale (India)",
      language: "English",
    },
    {
      id: "en-NZ",
      iso_639_2: "eng",
      name: "English locale (New Zealand)",
      language: "English",
    },
    {
      id: "en-US",
      iso_639_2: "eng",
      name: "English locale (United States)",
      language: "English",
    },
    {
      id: "en-ZA",
      iso_639_2: "eng",
      name: "English locale (South Africa)",
      language: "English",
    },
    {
      id: "eo",
      iso_639_2: "epo",
      name: "Esperanto locale",
      language: "Esperanto",
    },
    {
      id: "es",
      iso_639_2: "spa",
      name: "Spanish locale",
      language: "Spanish",
    },
    {
      id: "et",
      iso_639_2: "est",
      name: "Estonian locale",
      language: "Estonian",
    },
    {
      id: "eu",
      iso_639_2: "eus",
      name: "Basque locale",
      language: "Basque",
    },
    {
      id: "fa-IR",
      iso_639_2: "ira",
      name: "Persian/Farsi locale (Iran)",
      language: "Persian",
    },
    {
      id: "fi",
      iso_639_2: "fin",
      name: "Finnish locale",
      language: "Finnish",
    },
    {
      id: "fr",
      iso_639_2: "fra",
      name: "French locale",
      language: "French",
    },
    {
      id: "fr-CA",
      iso_639_2: "fra",
      name: "French locale (Canada)",
      language: "French",
    },
    {
      id: "fr-CH",
      iso_639_2: "fra",
      name: "French locale",
      language: "French",
    },
    {
      id: "gd",
      iso_639_2: "gla",
      name: "Scottish Gaelic",
      language: "Scottish Gaelic",
    },
    {
      id: "gl",
      iso_639_2: "glg",
      name: "Galician locale",
      language: "Galician",
    },
    {
      id: "gu",
      iso_639_2: "guj",
      name: "Gujarati locale (India)",
      language: "Gujarati",
    },
    {
      id: "he",
      iso_639_2: "heb",
      name: "Hebrew locale",
      language: "Hebrew",
    },
    {
      id: "hi",
      iso_639_2: "hin",
      name: "Hindi locale (India)",
      language: "Hindi",
    },
    {
      id: "hr",
      iso_639_2: "hrv",
      name: "Croatian locale",
      language: "Croatian",
    },
    {
      id: "ht",
      iso_639_2: "hat",
      name: "Haitian Creole locale",
      language: "Haitian Creole",
    },
    {
      id: "hu",
      iso_639_2: "hun",
      name: "Hungarian locale",
      language: "Hungarian",
    },
    {
      id: "hy",
      iso_639_2: "arm",
      name: "Armenian locale",
      language: "Armenian",
    },
    {
      id: "id",
      iso_639_2: "ind",
      name: "Indonesian locale",
      language: "Indonesian",
    },
    {
      id: "is",
      iso_639_2: "isl",
      name: "Icelandic locale",
      language: "Icelandic",
    },
    {
      id: "it",
      iso_639_2: "ita",
      name: "Italian locale",
      language: "Italian",
    },
    {
      id: "ja",
      iso_639_2: "jpn",
      name: "Japanese locale",
      language: "Japanese",
    },
    {
      id: "ja-Hira",
      iso_639_2: "jpn",
      name: "Japanese (Hiragana) locale",
      language: "Japanese (Hiragana)",
    },
    {
      id: "ka",
      iso_639_2: "geo",
      name: "Georgian locale",
      language: "Georgian",
    },
    {
      id: "kk",
      iso_639_2: "kaz",
      name: "Kazakh locale",
      language: "Kazakh",
    },
    {
      id: "kn",
      iso_639_2: "kan",
      name: "Kannada locale (India)",
      language: "Kannada",
    },
    {
      id: "ko",
      iso_639_2: "kor",
      name: "Korean locale",
      language: "Korean",
    },
    {
      id: "lb",
      iso_639_2: "ltz",
      name: "Luxembourgish locale",
      language: "Luxembourgish",
    },
    {
      id: "lt",
      iso_639_2: "lit",
      name: "Lithuanian locale",
      language: "Lithuanian",
    },
    {
      id: "lv",
      iso_639_2: "lav",
      name: "Latvian locale (Latvia)",
      language: "Latvian",
    },
    {
      id: "mk",
      iso_639_2: "mkd",
      name: "Macedonian locale",
      language: "Macedonian",
    },
    {
      id: "mn",
      iso_639_2: "mon",
      name: "Mongolian locale",
      language: "Mongolian",
    },
    {
      id: "ms",
      iso_639_2: "msa",
      name: "Malay locale",
      language: "Malay",
    },
    {
      id: "mt",
      iso_639_2: "mlt",
      name: "Maltese locale",
      language: "Maltese",
    },
    {
      id: "nb",
      iso_639_2: "nob",
      name: "Norwegian Bokmål locale",
      language: "Norwegian Bokmål",
    },
    {
      id: "nl",
      iso_639_2: "nld",
      name: "Dutch locale",
      language: "Dutch",
    },
    {
      id: "nl-BE",
      iso_639_2: "nld",
      name: "Dutch locale",
      language: "Dutch",
    },
    {
      id: "nn",
      iso_639_2: "nno",
      name: "Norwegian Nynorsk locale",
      language: "Norwegian Nynorsk",
    },
    {
      id: "pl",
      iso_639_2: "pol",
      name: "Polish locale",
      language: "Polish",
    },
    {
      id: "pt",
      iso_639_2: "por",
      name: "Portuguese locale",
      language: "Portuguese",
    },
    {
      id: "pt-BR",
      iso_639_2: "por",
      name: "Portuguese locale (Brazil)",
      language: "Portuguese",
    },
    {
      id: "ro",
      iso_639_2: "ron",
      name: "Romanian locale",
      language: "Romanian",
    },
    {
      id: "ru",
      iso_639_2: "rus",
      name: "Russian locale",
      language: "Russian",
    },
    {
      id: "sk",
      iso_639_2: "slk",
      name: "Slovak locale",
      language: "Slovak",
    },
    {
      id: "sl",
      iso_639_2: "slv",
      name: "Slovenian locale",
      language: "Slovenian",
    },
    {
      id: "sq",
      iso_639_2: "sqi",
      name: "Albanian locale",
      language: "Shqip",
    },
    {
      id: "sr",
      iso_639_2: "srp",
      name: "Serbian cyrillic locale",
      language: "Serbian",
    },
    {
      id: "sr-Latn",
      iso_639_2: "srp",
      name: "Serbian latin locale",
      language: "Serbian",
    },
    {
      id: "sv",
      iso_639_2: "swe",
      name: "Swedish locale",
      language: "Swedish",
    },
    {
      id: "ta",
      iso_639_2: "tam",
      name: "Tamil locale (India)",
      language: "Tamil",
    },
    {
      id: "te",
      iso_639_2: "tel",
      name: "Telugu locale",
      language: "Telugu",
    },
    {
      id: "th",
      iso_639_2: "tha",
      name: "Thai locale",
      language: "Thai",
    },
    {
      id: "tr",
      iso_639_2: "tur",
      name: "Turkish locale",
      language: "Turkish",
    },
    {
      id: "ug",
      iso_639_2: "uig",
      name: "Uighur locale",
      language: "Uighur",
    },
    {
      id: "uk",
      iso_639_2: "ukr",
      name: "Ukrainian locale",
      language: "Ukrainian",
    },
    {
      id: "uz",
      iso_639_2: "uzb",
      name: "Uzbek locale",
      language: "Uzbek",
    },
    {
      id: "vi",
      iso_639_2: "vie",
      name: "Vietnamese locale (Vietnam)",
      language: "Vietnamese",
    },
    {
      id: "zh-CN",
      iso_639_2: "zho",
      name: "Chinese Simplified locale",
      language: "Chinese Simplified",
    },
    {
      id: "zh-TW",
      iso_639_2: "zho",
      name: "Chinese Traditional locale",
      language: "Chinese Traditional",
    },
  ]

  return localesList
}

export function getDateLocale(id): any {
  const locales = getDateLanguageLocales()

  const i = locales.findIndex((el) => el.id == id)
  const usa = locales.find((el) => el.id == "en-US")

  if (i == -1) return usa
  return locales[i]
}