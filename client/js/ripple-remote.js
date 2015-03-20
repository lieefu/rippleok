var Remote = ripple.Remote;
var Servers ={
  trace: false,
  trusted:        true,
  local_signing:  true,
  local_fee:      true,
  fee_cushion:     1.5,
  servers:[{host: 's-east.ripple.com',port: 443,secure: true},{host:'s-west.ripple.com',port: 443,secure: true}]
};
var remote = new Remote(Servers);
