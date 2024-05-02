const { KinesisClient, PutRecordCommand } = require('@aws-sdk/client-kinesis');

const REGION = 'ap-southeast-1';
const STREAM_NAME = 'kinesis-stream';

const config = {
  region: REGION,
};

const client = new KinesisClient(config);

const TOTAL_RECORDS = 20;

const streamName = STREAM_NAME;

const generateData = (i) => {
  return {
    order_id: `ORD${i}`,
    order_user_id: `USR${i}`,
    order_items: [
      {
        item_id: `ITEM00${i}`,
        item_name: `Product Name ${i}`,
        quantity: i + 1,
        price: (i + 1) * 10.99,
        total_price: (i + 1) * 10.99 * (i + 1),
      },
      {
        item_id: `ITEM00${i + 1}`,
        item_name: `Product Name ${i + 1}`,
        quantity: i + 2,
        price: (i + 2) * 15.5,
        total_price: (i + 2) * 15.5 * (i + 2),
      },
    ],
    order_date: '2024-04-17',
    order_total_amount: (i + 1) * 10.99 * (i + 1) + (i + 2) * 15.5 * (i + 2),
    order_status: 'Pending',
  };
};

for (let i = 0; i < TOTAL_RECORDS; i++) {
  const jsonData = generateData(i);

  const data = JSON.stringify(jsonData);
  const partitionKey = `PartitionKey-${i}`;

  const input = {
    StreamName: streamName,
    Data: Buffer.from(data),
    PartitionKey: partitionKey,
  };

  const command = new PutRecordCommand(input);

  (async () => {
    try {
      const response = await client.send(command);
      console.log(`Record ${i} sent:`, response);
    } catch (error) {
      console.error(`Error sending record ${i}:`, error);
    }
  })();
}
