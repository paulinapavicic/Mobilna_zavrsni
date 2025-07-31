import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logout: {
    marginLeft: 12,
    color: '#e53935',
    fontWeight: '600',
  },
});
