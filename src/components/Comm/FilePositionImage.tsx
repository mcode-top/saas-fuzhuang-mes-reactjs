import { getOssPosistionToTimeLink } from '@/apis/file-manage/file-manage';
import type { AvatarProps } from 'antd';
import { Avatar } from 'antd';
import { useEffect, useState } from 'react';
import { PhotoSlider } from 'react-photo-view';

const FilePositionImage: React.FC<{
  src?: string;
  isRemote?: boolean;
  className?: string;
  avaterProps?: AvatarProps;
}> = (props) => {
  const [image, setImage] = useState<string>();
  const [visible, setVisible] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  function handleShowSlider() {
    setVisible(true);
  }
  function handleCloseSlider() {
    setVisible(false);
  }
  useEffect(() => {
    if (props.src) {
      if (props.isRemote) {
        getOssPosistionToTimeLink(props.src).then((res) => {
          setImage(res.data.url);
        });
      } else {
        setImage(props.src);
      }
    }
  }, [props.isRemote, props.src]);
  return (
    <>
      <PhotoSlider
        images={[{ src: image, key: 1 }]}
        visible={visible}
        onClose={handleCloseSlider}
        index={photoIndex}
        onIndexChange={setPhotoIndex}
      />
      <Avatar
        className={props.className}
        onClick={handleShowSlider}
        src={image}
        shape="square"
        size={32}
        {...(props?.avaterProps || {})}
      />
    </>
  );
};
export default FilePositionImage;
