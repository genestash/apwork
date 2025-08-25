import { useState, useId, Fragment } from 'react';
import { Loaded } from '@/components/navigation';
import { Button, Input } from '@/components/ui';
import style from './style.module.css';

// Types

type Field = {
    name: string;
    input: string;
    units: string;
    value: number;
    touched: boolean;
    order: number;
};

// Data

const defaultFields: Field[] = [
    { name: 'Cost', input: '', units: '$', value: 0, touched: false, order: 0 },
    { name: 'Revenue', input: '', units: '$', value: 0, touched: false, order: 0 },
    { name: 'Profit', input: '', units: '$', value: 0, touched: false, order: 0 },
    { name: 'Margin', input: '', units: '%', value: 0, touched: false, order: 0 }
];

// Utils

const parseNumber = (value: string) => {
    const number = parseFloat(value);
    return isNaN(number) ? 0 : number;
};

const formatNumber = (value: number) => {
    return Math.abs(value) < 0.01 ? '0.00' : value.toFixed(2);
};

// Recalculate fields values

function calculateFieldsValues(fields: Field[]): Field[] {
    const calculatedFields = [...fields];

    // We need two filled fields

    const filledFields = fields.filter((field) => field.input !== '');
    if (filledFields.length < 2) return calculatedFields;

    // Collect current values

    const values: Record<Field['name'], Field['value']> = {};

    for (const field of fields) {
        values[field.name] = field.value;
    }

    // Determinate fields to calculate

    const emptyFields = fields.filter((field) => field.input === '');

    const fieldsToCalculate =
        emptyFields.length > 0
            ? emptyFields.map((field) => field.name)
            : filledFields
                  .sort((a, b) => a.order - b.order)
                  .slice(0, 2)
                  .map((field) => field.name);

    // Calculate new values

    const presentedFields = fields.filter((field) => !fieldsToCalculate.includes(field.name)).map((field) => field.name);

    for (const name of fieldsToCalculate) {
        switch (name) {
            case 'Cost':
                if (presentedFields.includes('Revenue') && presentedFields.includes('Profit')) {
                    values.Cost = values.Revenue - values.Profit;
                } else if (presentedFields.includes('Revenue') && presentedFields.includes('Margin')) {
                    values.Cost = values.Revenue * (1 - values.Margin / 100);
                } else if (presentedFields.includes('Profit') && presentedFields.includes('Margin')) {
                    values.Cost = (values.Profit * 100) / values.Margin - values.Profit;
                }
                break;

            case 'Revenue':
                if (presentedFields.includes('Cost') && presentedFields.includes('Profit')) {
                    values.Revenue = values.Cost + values.Profit;
                } else if (presentedFields.includes('Profit') && presentedFields.includes('Margin')) {
                    values.Revenue = values.Profit / (values.Margin / 100);
                } else if (presentedFields.includes('Cost') && presentedFields.includes('Margin')) {
                    values.Revenue = values.Cost / (1 - values.Margin / 100);
                }
                break;

            case 'Profit':
                if (presentedFields.includes('Revenue') && presentedFields.includes('Cost')) {
                    values.Profit = values.Revenue - values.Cost;
                } else if (presentedFields.includes('Revenue') && presentedFields.includes('Margin')) {
                    values.Profit = (values.Margin / 100) * values.Revenue;
                } else if (presentedFields.includes('Cost') && presentedFields.includes('Margin')) {
                    values.Profit = (values.Margin / 100) * (values.Cost / (1 - values.Margin / 100));
                }
                break;

            case 'Margin':
                if (presentedFields.includes('Profit') && presentedFields.includes('Revenue')) {
                    values.Margin = (values.Profit / values.Revenue) * 100;
                } else if (presentedFields.includes('Profit') && presentedFields.includes('Cost')) {
                    values.Margin = (values.Profit / (values.Profit + values.Cost)) * 100;
                } else if (presentedFields.includes('Revenue') && presentedFields.includes('Cost')) {
                    values.Margin = ((values.Revenue - values.Cost) / values.Revenue) * 100;
                }
                break;
        }
    }

    // Insert new values

    calculatedFields.forEach((field) => {
        if (values[field.name] !== undefined) {
            field.value = isNaN(values[field.name]) ? 0 : values[field.name];
            field.touched = true;
        }
    });

    return calculatedFields;
}

// Components

export default function Application() {
    const [data, setData] = useState(() => structuredClone(defaultFields));
    const [activeField, setActiveField] = useState('');
    const componentId = useId();

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        const name = event.target.name;
        setActiveField(name);
    };

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const input = event.target.value;

        setData((data) => {
            let newData = [...data];

            for (const field of newData) {
                if (field.name === name) {
                    field.input = input;
                    field.value = parseNumber(input);
                    field.order = Date.now();
                    field.touched = true;
                    break;
                }
            }

            newData = calculateFieldsValues(newData);

            newData.forEach((field) => {
                if (field.name !== activeField) {
                    field.input = field.touched ? formatNumber(field.value) : '';
                }
            });

            return newData;
        });
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const input = event.target.value;
        const formatedInput = input ? formatNumber(parseNumber(input)) : '';

        setData((data) => {
            const newData = [...data];

            for (const field of newData) {
                if (field.name === name) {
                    field.input = formatedInput;
                    break;
                }
            }

            return newData;
        });

        setActiveField('');
    };

    const handleReset = () => {
        setData(structuredClone(defaultFields));
    };

    return (
        <>
            <b className={cn('h1', style.title)}>Margin Calculator</b>
            <div className={style.fields}>
                {data.map((field) => (
                    <Fragment key={field.name}>
                        <label htmlFor={`${componentId}-${field.name}`}>{field.name}</label>
                        <Input id={`${componentId}-${field.name}`} name={field.name} units={field.units} className={style.input} value={field.input} placeholder="0.00" onFocus={handleFocus} onChange={handleInput} onBlur={handleBlur} />
                    </Fragment>
                ))}
            </div>
            <Button onClick={handleReset} className={style.button}>
                Clear All
            </Button>
            <Loaded />
        </>
    );
}
