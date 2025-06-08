import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Animal } from '../models/Animal';
import { TypeAnimal } from '../models/TypeAnimal';
import { AnimalStatus } from '../models/AnimalStatus';
import { getAgeString } from '../utils/ageHelper';
import config from '../api/config';
import styles from './AnimalPage.module.css';

const AnimalPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [animal, setAnimal] = useState<Animal | null>(null);
    const [typeAnimals, setTypeAnimals] = useState<TypeAnimal[]>([]);
    const [animalStatuses, setAnimalStatuses] = useState<AnimalStatus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.animals}/${id}`);
                console.log('Fetching animal from:', `${config.api.baseUrl}${config.api.endpoints.animals}/${id}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Animal data:', data);
                setAnimal(data);

                const typesResponse = await fetch(`${config.api.baseUrl}${config.api.endpoints.typeAnimals}`);
                if (typesResponse.ok) {
                    const typesData = await typesResponse.json();
                    console.log('All type animals:', typesData);
                    setTypeAnimals(typesData);
                } else {
                    console.error('Failed to fetch type animals:', typesResponse.status);
                }

                const statusesResponse = await fetch(`${config.api.baseUrl}${config.api.endpoints.animalStatuses}`);
                if (statusesResponse.ok) {
                    const statusesData = await statusesResponse.json();
                    console.log('All animal statuses:', statusesData);
                    setAnimalStatuses(statusesData);
                } else {
                    console.error('Failed to fetch animal statuses:', statusesResponse.status);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Ошибка при загрузке данных животного');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const getTypeName = (typeId: string) => {
        const type = typeAnimals.find(t => t.id === typeId);
        return type?.name || 'Не указан';
    };

    const getStatusName = (statusId: string) => {
        const status = animalStatuses.find(s => s.id === statusId);
        return status?.name || 'Не указан';
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" />
            </div>
        );
    }

    if (!animal) {
        return (
            <div className={styles.container}>
                <Button 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate('/animals')}
                    className={styles.backButton}
                >
                    Назад к списку
                </Button>
                <Card className={styles.animalCard}>
                    <div className={styles.infoContainer}>
                        <h1 className={styles.name}>Животное не найдено</h1>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/animals')}
                className={styles.backButton}
            >
                Назад к списку
            </Button>
            
            <Card className={styles.animalCard}>
                {animal.photo && (
                    <div className={styles.photoContainer}>
                        <img
                            src={animal.photo.startsWith('http') ? animal.photo : `${config.api.baseUrl}${animal.photo}`}
                            alt={animal.name}
                            className={styles.photo}
                        />
                    </div>
                )}
                
                <div className={styles.infoContainer}>
                    <h1 className={styles.name}>{animal.name}</h1>
                    
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Возраст:</span>
                        <span className={styles.infoValue}>{getAgeString(animal.age)}</span>
                    </div>
                    
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Пол:</span>
                        <span className={styles.infoValue}>{animal.gender}</span>
                    </div>
                    
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Тип:</span>
                        <span className={styles.infoValue}>{getTypeName(animal.typeAnimalId)}</span>
                    </div>
                    
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Статус:</span>
                        <span className={styles.infoValue}>{getStatusName(animal.animalStatusId)}</span>
                    </div>

                    {animal.description && (
                        <div className={styles.description}>
                            <h2>Описание:</h2>
                            <p style={{ textAlign: 'left' }}>{animal.description}</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AnimalPage; 