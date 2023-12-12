import { Onfido, Region, Applicant, OnfidoApiError } from "@onfido/api";
const onfido = new Onfido({
  apiToken: process.env.ONFIDO_API_TOKEN!,
  // Supports Region.EU, Region.US and Region.CA
  region: Region.EU,
});

export default onfido;