import styles from './Animals.module.css';
import { useState } from 'react';
import { Button, message, Upload, UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import axios from 'axios';
import config from '../../api/config';

interface PhotoUploaderProps {
	photoPath: string;
	onPhotoChange: (path: string) => void;
}

export const PhotoUploader = ({
	photoPath,
	onPhotoChange,
}: PhotoUploaderProps) => {
	const [uploading, setUploading] = useState(false);

	const handleRemovePhoto = async () => {
		if (!photoPath) return;
		try {
			await axios.delete(
				`${config.api.upload.baseUrl}${config.api.upload.endpoints.deletePhoto}?photoPath=${photoPath}`
			);
			onPhotoChange('');
			message.success('Фото успешно удалено');
		} catch (error) {
			console.error('Error deleting photo:', error);
			message.error('Ошибка при удалении фото');
		}
	};

	const uploadProps: UploadProps = {
		beforeUpload: async file => {
			setUploading(true);
			try {
				const formData = new FormData();
				formData.append('file', file);
				const response = await axios.post<{ filePath: string }>(
					`${config.api.upload.baseUrl}${config.api.upload.endpoints.uploadPhoto}`,
					formData,
					{ headers: { 'Content-Type': 'multipart/form-data' } }
				);
				onPhotoChange(response.data.filePath);
				message.success('Фото успешно загружено');
			} catch (error) {
				console.error('Upload error:', error);
				message.error('Ошибка загрузки фото');
			} finally {
				setUploading(false);
			}
			return false;
		},
		showUploadList: false,
		accept: 'image/*',
		multiple: false,
		capture: 'environment' as const,
	};

	return (
		<div className={styles.modal__upload__container}>
			{photoPath && (
				<div className={styles.modal__img__container}>
					<Image
						src={
							photoPath.startsWith('http')
								? photoPath
								: `${config.api.baseUrl}${photoPath}`
						}
						className={styles.modal__img}
						preview={false}
					/>
				</div>
			)}
			<div className={styles.modal__buttons}>
				<Upload {...uploadProps}>
					<Button icon={<UploadOutlined />} loading={uploading}>
						{photoPath ? 'Заменить фото' : 'Загрузить фото'}
					</Button>
				</Upload>
				{photoPath && (
					<Button danger onClick={handleRemovePhoto}>
						Удалить фото
					</Button>
				)}
			</div>
		</div>
	);
};