import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Platform,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { Text } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeInUp, 
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay
} from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Switch } from '@/components/ui/Switch';
import { useAdminStats, useRecentOrders, useAddProduct, useToggleStock, useUploadProductImage, useCoupons, useCreateCoupon, useDeleteCoupon, useDeleteProduct } from '@/hooks/useAdmin';
import { useProducts, useCategories } from '@/hooks/useProducts';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const CHART_DATA = [40, 65, 45, 80, 55, 90, 75];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AdminDashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const [activeTab, setActiveTab] = useState('Overview');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isCouponModalVisible, setIsCouponModalVisible] = useState(false);

  // Queries
  const { data: stats, isLoading: isLoadingStats } = useAdminStats();
  const { data: recentOrders, isLoading: isLoadingOrders } = useRecentOrders();
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { data: categories } = useCategories();
  const { data: coupons, isLoading: isLoadingCoupons } = useCoupons();

  // Mutations
  const addProductMutation = useAddProduct();
  const toggleStockMutation = useToggleStock();
  const uploadImageMutation = useUploadProductImage();
  const createCouponMutation = useCreateCoupon();
  const deleteCouponMutation = useDeleteCoupon();
  const deleteProductMutation = useDeleteProduct();

  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image: '',
    short_description: '',
  });

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    product_id: '',
  });

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      try {
        const publicUrl = await uploadImageMutation.mutateAsync({ 
          uri, 
          fileName: `product_${Date.now()}.jpg` 
        });
        setNewProduct(prev => ({ ...prev, image: publicUrl }));
      } catch (error) {
        Alert.alert('Upload Failed', 'Could not upload product image.');
      }
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      Alert.alert('Missing Fields', 'Please fill in name and price.');
      return;
    }

    try {
      // Generate slug from name
      const slug = newProduct.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      await addProductMutation.mutateAsync({
        ...newProduct,
        slug,
        price: parseFloat(newProduct.price),
        category_id: newProduct.category_id || categories?.[0]?.id,
      });
      setIsAddModalVisible(false);
      setNewProduct({ name: '', description: '', price: '', category_id: '', image: '', short_description: '' });
      Alert.alert('Success', 'Product added successfully!');
    } catch (error: any) {
      console.error('Add product error:', error);
      Alert.alert('Error', `Failed to add product: ${error.message || 'Check if you applied the SQL migration.'}`);
    }
  };

  const handleCreateCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount_value) {
      Alert.alert('Missing Fields', 'Please fill in code and value.');
      return;
    }

    try {
      await createCouponMutation.mutateAsync({
        ...newCoupon,
        discount_value: parseFloat(newCoupon.discount_value),
        product_id: newCoupon.product_id || null,
      });
      setIsCouponModalVisible(false);
      setNewCoupon({ code: '', discount_type: 'percentage', discount_value: '', product_id: '' });
      Alert.alert('Success', 'Coupon created successfully!');
    } catch (error: any) {
      console.error('Create coupon error:', error);
      Alert.alert('Error', `Failed to create coupon: ${error.message || 'Check if you applied the SQL migration.'}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return colors.saffron;
      case 'packed': return '#3498DB';
      case 'delivered': return colors.cardamom;
      case 'cancelled': return colors.chili;
      default: return colors.tabIconDefault;
    }
  };

  const ChartBar = ({ value, index }: { value: number, index: number }) => {
    const height = useSharedValue(0);

    React.useEffect(() => {
      height.value = withDelay(index * 100, withTiming(value, { duration: 1000 }));
    }, []);

    const rStyle = useAnimatedStyle(() => ({
      height: `${height.value}%`
    }));

    return (
      <View style={styles.chartCol}>
        <View style={styles.chartBarBg}>
          <Animated.View style={[styles.chartBarFill, { backgroundColor: colors.saffron }, rStyle]} />
        </View>
        <Text variant="caption" style={{ fontSize: 10, opacity: 0.5, marginTop: 8 }}>{DAYS[index]}</Text>
      </View>
    );
  };

  const KPI_DATA = [
    { label: 'Total Revenue', value: `₹${stats?.total_revenue || 0}`, icon: 'wallet-outline', color: '#E2B714', trend: '+12%' },
    { label: 'Active Orders', value: stats?.active_orders || 0, icon: 'cube-outline', color: '#2E8B57', trend: '+5%' },
    { label: 'Low Stock', value: stats?.low_stock || 0, icon: 'warning-outline', color: '#C41E3A', trend: '!' },
    { label: 'Avg Rating', value: stats?.avg_rating || 0, icon: 'star-outline', color: '#E8590C', trend: '+0.1' },
  ];

  const renderOverview = () => (
    <>
      <View style={styles.kpiGrid}>
        {KPI_DATA.map((stat, i) => (
          <Animated.View key={stat.label} entering={FadeInUp.delay(i * 100)} style={{ width: '48%', marginBottom: 15 }}>
            <Card glass intensity={isDark ? 20 : 60} style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <View style={[styles.kpiIcon, { backgroundColor: stat.color + '15' }]}>
                  <Ionicons name={stat.icon as any} size={18} color={stat.color} />
                </View>
                <View style={[styles.trendBadge, { backgroundColor: stat.trend.includes('+') ? colors.cardamom + '15' : colors.chili + '15' }]}>
                  <Text style={{ fontSize: 10, color: stat.trend.includes('+') ? colors.cardamom : colors.chili, fontWeight: 'bold' }}>{stat.trend}</Text>
                </View>
              </View>
              {isLoadingStats ? (
                <ActivityIndicator size="small" color={colors.saffron} style={{ marginTop: 15 }} />
              ) : (
                <Text variant="h2" family="heading" style={{ marginTop: 15 }}>{stat.value}</Text>
              )}
              <Text variant="caption" style={{ opacity: 0.6, marginTop: 4 }}>{stat.label}</Text>
            </Card>
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
        <Card glass intensity={isDark ? 10 : 50} style={styles.chartCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text variant="overline" family="badge" style={styles.sectionTitle}>WEEKLY REVENUE</Text>
              <Text variant="h2" family="price">₹28,450</Text>
            </View>
          </View>
          <View style={styles.chartArea}>
             {CHART_DATA.map((val, i) => (
               <ChartBar key={i} value={val} index={i} />
             ))}
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(600)} style={styles.section}>
        <View style={styles.sectionHeader}>
           <Text variant="overline" family="badge" style={styles.sectionTitle}>LIVE ORDERS</Text>
        </View>
        
        <View style={[styles.ordersList, { backgroundColor: colors.card || '#fff' }]}>
          {isLoadingOrders ? (
            <ActivityIndicator color={colors.saffron} style={{ padding: 40 }} />
          ) : recentOrders && recentOrders.length > 0 ? (
            recentOrders.map((order: any, i: number) => (
              <View key={order.id} style={[
                styles.orderRow,
                i === recentOrders.length - 1 && { borderBottomWidth: 0 }
              ]}>
                <View style={styles.orderAvatar}>
                  <Text variant="body2" family="heading" style={{ color: '#fff' }}>{order.profiles?.full_name?.charAt(0) || 'U'}</Text>
                </View>
                <View style={styles.orderInfo}>
                  <Text variant="body1" family="heading">{order.profiles?.full_name || 'User'}</Text>
                  <Text variant="caption" style={{ opacity: 0.6 }}>#{order.order_number} • {order.items_count} items</Text>
                </View>
                <View style={styles.orderMeta}>
                  <Text variant="body2" family="price">₹{order.total_amount}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
                    <Text style={{ fontSize: 8, color: getStatusColor(order.status), fontWeight: 'bold' }}>{order.status.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text variant="caption" style={{ opacity: 0.5, textAlign: 'center', padding: 20 }}>No active orders.</Text>
          )}
        </View>
      </Animated.View>
    </>
  );

  const renderInventory = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="overline" family="badge" style={styles.sectionTitle}>PRODUCT CATALOG</Text>
        <Button 
          title="Add Product" 
          size="small" 
          onPress={() => setIsAddModalVisible(true)}
          variant="primary"
        />
      </View>

      {isLoadingProducts ? (
        <ActivityIndicator color={colors.saffron} style={{ marginTop: 20 }} />
      ) : (
        products?.map((product) => (
          <Card key={product.id} style={styles.productCard}>
            <View style={styles.productRow}>
              <Image 
                source={{ uri: product.image || 'https://via.placeholder.com/150' }} 
                style={styles.productThumb} 
              />
              <View style={styles.productInfo}>
                <Text variant="body1" family="heading">{product.name}</Text>
                <Text variant="caption" style={{ opacity: 0.6 }}>₹{product.price} • {product.total_sold || 0} sold</Text>
              </View>
              <View style={styles.stockControl}>
                <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
                  <TouchableOpacity 
                    onPress={() => {
                      Alert.alert(
                        'Delete Product',
                        `Are you sure you want to delete ${product.name}?`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Delete', style: 'destructive', onPress: () => deleteProductMutation.mutate(product.id) }
                        ]
                      );
                    }}
                    style={{ padding: 5 }}
                  >
                    <Ionicons name="trash-outline" size={22} color={colors.chili} />
                  </TouchableOpacity>
                  <View style={{ alignItems: 'center' }}>
                    <Text variant="caption" style={{ marginBottom: 4 }}>Stock</Text>
                    <Switch 
                      value={!product.is_out_of_stock} 
                      onValueChange={(val) => toggleStockMutation.mutate({ id: product.id, isOutOfStock: !val })} 
                    />
                  </View>
                </View>
              </View>
            </View>
          </Card>
        ))
      )}
    </View>
  );

  const renderCoupons = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="overline" family="badge" style={styles.sectionTitle}>ACTIVE COUPONS</Text>
        <Button 
          title="New Coupon" 
          size="small" 
          onPress={() => setIsCouponModalVisible(true)}
          variant="primary"
        />
      </View>

      {isLoadingCoupons ? (
        <ActivityIndicator color={colors.saffron} style={{ marginTop: 20 }} />
      ) : (
        coupons?.map((coupon: any) => (
          <Card key={coupon.id} style={styles.couponCard}>
            <View style={styles.couponRow}>
              <View style={styles.couponInfo}>
                <Text variant="body1" family="heading" style={{ color: colors.saffron }}>{coupon.code}</Text>
                <Text variant="caption" style={{ opacity: 0.6 }}>
                  {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                  {coupon.products ? ` • Only on ${coupon.products.name}` : ' • All Products'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => deleteCouponMutation.mutate(coupon.id)}>
                <Ionicons name="trash-outline" size={20} color={colors.chili} />
              </TouchableOpacity>
            </View>
          </Card>
        ))
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text variant="h2" family="heading">Admin Dashboard</Text>
            <Text variant="caption" style={{ color: colors.saffron }}>Superuser Access</Text>
          </View>
        </View>

        {/* Custom Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {['Overview', 'Inventory', 'Coupons', 'Orders', 'Settings'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabBtn, 
                activeTab === tab && { backgroundColor: colors.saffron }
              ]}
            >
              <Text 
                variant="body2" 
                family="heading" 
                style={{ color: activeTab === tab ? '#000' : colors.text, opacity: activeTab === tab ? 1 : 0.6 }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Inventory' && renderInventory()}
        {activeTab === 'Coupons' && renderCoupons()}
        {['Orders', 'Settings'].includes(activeTab) && (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ opacity: 0.5 }}>Module coming soon...</Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Product Modal */}
      <Modal visible={isAddModalVisible} onClose={() => setIsAddModalVisible(false)}>
        <Text variant="h3" family="heading" style={{ marginBottom: 20 }}>Add New Product</Text>
        <ScrollView style={{ maxHeight: 400 }}>
          <TouchableOpacity style={styles.imagePlaceholder} onPress={handlePickImage}>
            {newProduct.image ? (
              <Image source={{ uri: newProduct.image }} style={styles.previewImage} />
            ) : (
              <>
                <Ionicons name="camera-outline" size={32} color={colors.tabIconDefault} />
                <Text variant="caption">Upload Image</Text>
              </>
            )}
          </TouchableOpacity>
          <Input 
            label="Product Name" 
            value={newProduct.name} 
            onChangeText={(t) => setNewProduct(p => ({ ...p, name: t }))} 
          />
          <Input 
            label="Short Description" 
            value={newProduct.short_description} 
            onChangeText={(t) => setNewProduct(p => ({ ...p, short_description: t }))} 
          />
          <Input 
            label="Full Description" 
            multiline 
            style={{ height: 100 }}
            value={newProduct.description} 
            onChangeText={(t) => setNewProduct(p => ({ ...p, description: t }))} 
          />
          <Input 
            label="Price (₹)" 
            keyboardType="numeric"
            value={newProduct.price} 
            onChangeText={(t) => setNewProduct(p => ({ ...p, price: t }))} 
          />
          <Text variant="caption" style={{ marginBottom: 8 }}>Category</Text>
          <View style={styles.categoryPicker}>
            {categories?.map((cat) => (
              <TouchableOpacity 
                key={cat.id} 
                style={[
                  styles.catItem, 
                  newProduct.category_id === cat.id && { backgroundColor: colors.saffron + '30', borderColor: colors.saffron }
                ]}
                onPress={() => setNewProduct(p => ({ ...p, category_id: cat.id }))}
              >
                <Text style={{ fontSize: 10 }}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={styles.modalActions}>
          <Button title="Cancel" variant="outline" onPress={() => setIsAddModalVisible(false)} style={{ flex: 1, marginRight: 10 }} />
          <Button 
            title={addProductMutation.isPending ? "Adding..." : "Add Product"} 
            onPress={handleAddProduct} 
            style={{ flex: 1 }} 
            disabled={addProductMutation.isPending}
          />
        </View>
      </Modal>

      {/* Add Coupon Modal */}
      <Modal visible={isCouponModalVisible} onClose={() => setIsCouponModalVisible(false)}>
        <Text variant="h3" family="heading" style={{ marginBottom: 20 }}>Create Coupon</Text>
        <Input 
          label="Coupon Code" 
          placeholder="e.g. SPICE20"
          value={newCoupon.code} 
          onChangeText={(t) => setNewCoupon(p => ({ ...p, code: t.toUpperCase() }))} 
        />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text variant="caption" style={{ marginBottom: 8 }}>Type</Text>
            <TouchableOpacity 
              style={[styles.typeToggle, newCoupon.discount_type === 'percentage' && { backgroundColor: colors.saffron }]}
              onPress={() => setNewCoupon(p => ({ ...p, discount_type: 'percentage' }))}
            >
              <Text style={{ color: newCoupon.discount_type === 'percentage' ? '#000' : colors.text }}>Percentage</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="caption" style={{ marginBottom: 8 }}>Value</Text>
            <Input 
              placeholder="e.g. 20"
              keyboardType="numeric"
              value={newCoupon.discount_value} 
              onChangeText={(t) => setNewCoupon(p => ({ ...p, discount_value: t }))} 
            />
          </View>
        </View>
        <Text variant="caption" style={{ marginBottom: 8 }}>Apply to specific product? (Optional)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          <TouchableOpacity 
            style={[styles.catItem, !newCoupon.product_id && { backgroundColor: colors.saffron + '30' }]}
            onPress={() => setNewCoupon(p => ({ ...p, product_id: '' }))}
          >
            <Text style={{ fontSize: 10 }}>All Products</Text>
          </TouchableOpacity>
          {products?.map((p) => (
            <TouchableOpacity 
              key={p.id} 
              style={[styles.catItem, newCoupon.product_id === p.id && { backgroundColor: colors.saffron + '30' }]}
              onPress={() => setNewCoupon(prev => ({ ...prev, product_id: p.id }))}
            >
              <Text style={{ fontSize: 10 }}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.modalActions}>
          <Button title="Cancel" variant="outline" onPress={() => setIsCouponModalVisible(false)} style={{ flex: 1, marginRight: 10 }} />
          <Button 
            title={createCouponMutation.isPending ? "Creating..." : "Create"} 
            onPress={handleCreateCoupon} 
            style={{ flex: 1 }} 
            disabled={createCouponMutation.isPending}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    zIndex: 10,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  backBtn: { marginRight: 15 },
  tabsContainer: { paddingHorizontal: 20, paddingBottom: 15, gap: 10 },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  scrollContent: { padding: 20 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 15 },
  kpiCard: { padding: 15, borderRadius: 24 },
  kpiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  kpiIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  trendBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 15 },
  sectionTitle: { opacity: 0.5, letterSpacing: 1.5, marginBottom: 5 },
  chartCard: { padding: 20, borderRadius: 24 },
  chartArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150, marginTop: 20 },
  chartCol: { alignItems: 'center', flex: 1 },
  chartBarBg: { width: 12, height: '100%', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  chartBarFill: { width: '100%', borderRadius: 6 },
  ordersList: { borderRadius: 24, padding: 10, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  orderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(0,0,0,0.05)' },
  orderAvatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  orderInfo: { flex: 1 },
  orderMeta: { alignItems: 'flex-end' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 4 },
  productCard: { marginBottom: 12, padding: 12, borderRadius: 16 },
  productRow: { flexDirection: 'row', alignItems: 'center' },
  productThumb: { width: 60, height: 60, borderRadius: 12, marginRight: 15 },
  productInfo: { flex: 1 },
  stockControl: { alignItems: 'center' },
  couponCard: { marginBottom: 12, padding: 16, borderRadius: 16 },
  couponRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  couponInfo: { flex: 1 },
  imagePlaceholder: { height: 120, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.05)', borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 20, overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },
  categoryPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  catItem: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
  modalActions: { flexDirection: 'row', marginTop: 20 },
  typeToggle: { height: 50, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center' },
});
