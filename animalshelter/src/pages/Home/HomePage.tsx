import React from 'react';
import { Layout, Card, Button, Row, Col, Typography, Image } from 'antd';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import adoptImage from './images/adopt.jpg';
import fosterImage from './images/foster.jpg';
import volunteerImage from './images/volunteer.jpg';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const HomePage: React.FC = () => {
	return (
		<Content className={styles.homeContent}>
			{/* Герой-баннер */}
			<div className={styles.heroBanner}>
				<div className={styles.heroText}>
					<Title level={1} className={styles.heroTitle}>
						Дадим дом каждому питомцу
					</Title>
					<Paragraph className={styles.heroSubtitle}>
						Помогите животным обрести любящую семью или станьте временным домом
					</Paragraph>
					<div className={styles.heroButtons}>
						<Button type='primary' size='large' className={styles.heroButton}>
							<Link to='/animals'>Посмотреть животных</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* Основной контент */}
			<div className={styles.mainContent}>
				{/* Наши успехи */}
				<div className={styles.statsSection}>
					<Title level={2} className={styles.sectionTitle}>
						Наши успехи
					</Title>
					<Row gutter={[24, 24]}>
						<Col xs={24} sm={8}>
							<div className={styles.statCard}>
								<Title level={1} className={styles.statNumber}>
									1,200+
								</Title>
								<Paragraph>Животных нашли дом</Paragraph>
							</div>
						</Col>
						<Col xs={24} sm={8}>
							<div className={styles.statCard}>
								<Title level={1} className={styles.statNumber}>
									300+
								</Title>
								<Paragraph>Волонтеров помогают</Paragraph>
							</div>
						</Col>
						<Col xs={24} sm={8}>
							<div className={styles.statCard}>
								<Title level={1} className={styles.statNumber}>
									15
								</Title>
								<Paragraph>Лет работы приюта</Paragraph>
							</div>
						</Col>
					</Row>
				</div>

				{/* Как помочь */}
				<Title level={2} className={styles.sectionTitle}>
					Как вы можете помочь
				</Title>
				<Row gutter={[24, 24]} className={styles.helpCards}>
					<Col xs={24} sm={12} md={8} className={styles.cardCol}>
						<Link to='/animals'>
							<Card
								hoverable
								cover={
									<Image
										src={adoptImage}
										preview={false}
										alt='Усыновить'
										className={styles.cardImage}
									/>
								}
								className={styles.helpCard}
							>
								<Card.Meta
									title='Усыновить'
									description='Дайте постоянный дом животному из приюта'
								/>
							</Card>
						</Link>
					</Col>
					<Col xs={24} sm={12} md={8} className={styles.cardCol}>
						<Link to='/animals'>
							<Card
								hoverable
								cover={
									<Image
										src={fosterImage}
										preview={false}
										alt='Взять на передержку'
										className={styles.cardImage}
									/>
								}
								className={styles.helpCard}
							>
								<Card.Meta
									title='Взять на передержку'
									description='Помогите временным уходом за животным'
								/>
							</Card>
						</Link>
					</Col>
					<Col xs={24} sm={12} md={8} className={styles.cardCol}>
						<Link to='/register'>
							<Card
								hoverable
								cover={
									<Image
										src={volunteerImage}
										preview={false}
										alt='Стать работником приюта'
										className={styles.cardImage}
									/>
								}
								className={styles.helpCard}
							>
								<Card.Meta
									title='Стать работником'
									description='Присоединяйтесь к нашей команде'
								/>
							</Card>
						</Link>
					</Col>
				</Row>
			</div>
		</Content>
	);
};

export default HomePage;