import React from 'react';
import { Select, InputNumber, Space } from 'antd';
import { TypeAnimal } from '../../models/TypeAnimal';
import { AnimalStatus } from '../../models/AnimalStatus';

interface AnimalFiltersProps {
    typeAnimals: TypeAnimal[];
    animalStatuses: AnimalStatus[];
    onFilterChange: (filters: AnimalFilters) => void;
}

export interface AnimalFilters {
    typeAnimalId?: string;
    gender?: string;
    minAge?: number;
    maxAge?: number;
    animalStatusId?: string;
}

export const AnimalFilters: React.FC<AnimalFiltersProps> = ({
    typeAnimals,
    animalStatuses,
    onFilterChange,
}) => {
    const [filters, setFilters] = React.useState<AnimalFilters>({});

    const handleFilterChange = (newFilters: Partial<AnimalFilters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        onFilterChange(updatedFilters);
    };

    return (
        <Space size="middle">
            <Select
                style={{ width: 130 }}
                placeholder="Вид животного"
                allowClear
                onChange={(value) => handleFilterChange({ typeAnimalId: value })}
            >
                {typeAnimals.map((type) => (
                    <Select.Option key={type.id} value={type.id}>
                        {type.name}
                    </Select.Option>
                ))}
            </Select>

            <Select
                style={{ width: 120 }}
                placeholder="Пол"
                allowClear
                onChange={(value) => handleFilterChange({ gender: value })}
            >
                <Select.Option value="Мальчик">Мальчик</Select.Option>
                <Select.Option value="Девочка">Девочка</Select.Option>
            </Select>

            <Space>
                <InputNumber
                    style={{ width: 120 }}
                    placeholder="Мин. возраст"
                    min={0}
                    onChange={(value) => handleFilterChange({ minAge: value || undefined })}
                />
                <InputNumber
                    style={{ width: 120 }}
                    placeholder="Макс. возраст"
                    min={0}
                    onChange={(value) => handleFilterChange({ maxAge: value || undefined })}
                />
            </Space>

            <Select
                style={{ width: 230 }}
                placeholder="Статус"
                allowClear
                onChange={(value) => handleFilterChange({ animalStatusId: value })}
            >
                {animalStatuses.map((status) => (
                    <Select.Option key={status.id} value={status.id}>
                        {status.name}
                    </Select.Option>
                ))}
            </Select>
        </Space>
    );
}; 