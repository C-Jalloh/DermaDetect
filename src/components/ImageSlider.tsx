import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Modal, ScrollView, Image as RNImage } from 'react-native';
import { Text } from 'react-native-paper';
import { theme } from '../utils/theme';

const { width: screenWidth } = Dimensions.get('window');

interface ImageSliderProps {
  images: string[];
  imageStyle?: any;
  containerStyle?: any;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  imageStyle,
  containerStyle,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  };

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  const closePreview = () => {
    setPreviewVisible(false);
  };

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex ? styles.paginationDotActive : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>
    );
  };

  if (images.length === 0) {
    return (
      <View style={[styles.emptyContainer, containerStyle]}>
        <Text style={styles.emptyText}>No images available</Text>
      </View>
    );
  }

  return (
    <>
      <View style={[styles.container, containerStyle]}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {images.map((imageUri, index) => (
            <TouchableOpacity
              key={index}
              style={styles.slide}
              onPress={() => openPreview(index)}
              activeOpacity={0.8}
            >
              <RNImage
                source={{ uri: imageUri }}
                style={[styles.image, imageStyle]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        {images.length > 1 && renderPagination()}
      </View>

      {/* Image Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closePreview}
      >
        <View style={styles.previewOverlay}>
          <TouchableOpacity
            style={styles.previewCloseButton}
            onPress={closePreview}
          >
            <Text style={styles.previewCloseText}>✕</Text>
          </TouchableOpacity>

          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.previewScrollView}
            contentOffset={{ x: previewIndex * screenWidth, y: 0 }}
          >
            {images.map((imageUri, index) => (
              <View key={index} style={styles.previewSlide}>
                <RNImage
                  source={{ uri: imageUri }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          {images.length > 1 && (
            <View style={styles.previewPagination}>
              <Text style={styles.previewPaginationText}>
                {previewIndex + 1} / {images.length}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollView: {
    width: screenWidth,
  },
  slide: {
    width: screenWidth * 0.8,
    marginHorizontal: screenWidth * 0.1,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: theme.colors.primary,
  },
  paginationDotInactive: {
    backgroundColor: theme.colors.textSecondary,
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  previewCloseText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  previewScrollView: {
    flex: 1,
    width: screenWidth,
  },
  previewSlide: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: screenWidth,
    height: screenWidth,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  previewPagination: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  previewPaginationText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});

export default ImageSlider;