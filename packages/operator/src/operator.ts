import {ambassadorOperator} from './ambassador';
import {databaseOperator} from './database';
import {jwksOperator} from './jwks';
import figlet from 'figlet';

const bootstrap = async () => {
  console.log(figlet.textSync('Hana Operator'.toUpperCase(), {font: 'Standard', horizontalLayout: 'full'}));

  const operators = [
    ambassadorOperator,
    jwksOperator,
    databaseOperator,
  ];

  await Promise.all(operators.map((operator) => operator.start()));

  const exit = (reason: string) => {
    operators.forEach((operator) => operator.stop());

    process.exit(0);
  };

  process
      .on('SIGTERM', () => exit('SIGTERM'))
      .on('SIGINT', () => exit('SIGINT'));
};

void bootstrap();
