const testJson2 = `{
 "$schema": "http://json-schema.org/draft-04/schema#",
 "type": "object",
 "properties": {
   "@context": {
     "type": "string"
   },
   "@type": {
     "type": "string"
   },
   "address": {
     "type": "object",
     "properties": {
       "@type": {
         "type": "string"
       },
       "addressCountry": {
         "type": "string"
         "pattern": "[A-Z][A-Z]"
       },
       "addressLocality": {
         "type": "string"
       },
       "addressRegion": {
         "type": "string"
       },
       "postalCode": {
         "type": "string"
       }
     },
     "required": [
       "@type",
       "addressCountry",
       "addressLocality",
       "addressRegion",
       "postalCode"
     ]
   },
   "department": {
     "type": "string"
   },
   "legalName": {
     "type": "string"
   }
 },
 "required": [
   "@context",
   "@type",
   "address",
   "department",
   "legalName"
 ]
}
`

export default testJson2
