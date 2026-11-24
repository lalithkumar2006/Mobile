import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { DemoSwitcher } from './components/DemoSwitcher';
import { MobileFrame } from './components/MobileFrame';

// Customer screens (running inside the mobile-first mobile web experience)
import { QRScanScreen } from './pages/customer/QRScanScreen';
import { MenuScreen } from './pages/customer/MenuScreen';
import { CartScreen } from './pages/customer/CartScreen';
import { ConfirmationScreen } from './pages/customer/ConfirmationScreen';
import { TrackingScreen } from './pages/customer/TrackingScreen';
import { FeedbackScreen } from './pages/customer/FeedbackScreen';

// Kitchen screen
import { KitchenDashboard } from './pages/kitchen/KitchenDashboard';

// Admin screens & layout
import { AdminLayout } from './layouts/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { OrdersManagement } from './pages/admin/OrdersManagement';
import { FoodMenuManagement } from './pages/admin/FoodMenuManagement';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { TableManagement } from './pages/admin/TableManagement';
import { CustomerFeedbackManagement } from './pages/admin/CustomerFeedbackManagement';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        {/* Prototype Experience Switcher */}
        <DemoSwitcher />

        <Routes>
          {/* Default entry redirects to customer mobile web menu */}
          <Route path="/" element={<Navigate to="/customer/menu" replace />} />

          {/* Customer Experience inside Mobile Web Frame */}
          <Route
            path="/customer/scan"
            element={
              <MobileFrame>
                <QRScanScreen />
              </MobileFrame>
            }
          />
          <Route
            path="/customer/menu"
            element={
              <MobileFrame>
                <MenuScreen />
              </MobileFrame>
            }
          />
          <Route
            path="/customer/cart"
            element={
              <MobileFrame>
                <CartScreen />
              </MobileFrame>
            }
          />
          <Route
            path="/customer/confirmation/:orderId"
            element={
              <MobileFrame>
                <ConfirmationScreen />
              </MobileFrame>
            }
          />
          <Route
            path="/customer/track/:orderId"
            element={
              <MobileFrame>
                <TrackingScreen />
              </MobileFrame>
            }
          />
          <Route
            path="/customer/feedback/:orderId"
            element={
              <MobileFrame>
                <FeedbackScreen />
              </MobileFrame>
            }
          />

          {/* Kitchen Display System */}
          <Route path="/kitchen" element={<KitchenDashboard />} />

          {/* Admin Management Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/overview" replace />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="menu" element={<FoodMenuManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="tables" element={<TableManagement />} />
            <Route path="qr" element={<TableManagement />} />
            <Route path="feedback" element={<CustomerFeedbackManagement />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch all fallback */}
          <Route path="*" element={<Navigate to="/customer/menu" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
