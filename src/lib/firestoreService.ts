import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from './firebase';
import {
  Student,
  Teacher,
  Staff,
  Administrator,
  AttendanceRecord,
  FeeTransaction,
  Announcement,
  ClassTopper,
  SchoolWebsiteConfig,
  RolePermissions,
  UserCredential
} from '../types/school';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('[Firestore Error]:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Collection Names
export const COLLECTIONS = {
  SITE_CONFIG: 'site_config',
  STUDENTS: 'students',
  TEACHERS: 'teachers',
  STAFF: 'staff',
  ADMINISTRATORS: 'administrators',
  ATTENDANCE: 'attendance_records',
  TRANSACTIONS: 'fee_transactions',
  ANNOUNCEMENTS: 'announcements',
  TOPPERS: 'toppers',
  ROLE_PERMISSIONS: 'role_permissions',
  USER_CREDENTIALS: 'user_credentials'
} as const;

// Save single document
export async function saveDocument<T extends { id: string }>(collectionName: string, item: T): Promise<void> {
  const docRef = doc(db, collectionName, item.id);
  try {
    await setDoc(docRef, item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${item.id}`);
  }
}

// Remove document
export async function removeDocument(collectionName: string, id: string): Promise<void> {
  const docRef = doc(db, collectionName, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
  }
}

// Save named singleton config
export async function saveSingletonConfig<T extends object>(collectionName: string, docId: string, data: T): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  try {
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId}`);
  }
}

// Fetch singleton config
export async function getSingletonConfig<T>(collectionName: string, docId: string): Promise<T | null> {
  const docRef = doc(db, collectionName, docId);
  try {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as T;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${collectionName}/${docId}`);
  }
}

// Subscribe to collection in real-time
export function subscribeToCollection<T>(
  collectionName: string,
  onData: (items: T[]) => void,
  onError?: (errInfo: FirestoreErrorInfo) => void
): () => void {
  const colRef = collection(db, collectionName);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: T[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as T);
      });
      onData(items);
    },
    (error) => {
      const errInfo: FirestoreErrorInfo = {
        error: error instanceof Error ? error.message : String(error),
        authInfo: {
          userId: auth.currentUser?.uid,
          email: auth.currentUser?.email,
          emailVerified: auth.currentUser?.emailVerified,
          isAnonymous: auth.currentUser?.isAnonymous,
          tenantId: auth.currentUser?.tenantId,
          providerInfo: auth.currentUser?.providerData?.map(provider => ({
            providerId: provider.providerId,
            email: provider.email,
          })) || []
        },
        operationType: OperationType.LIST,
        path: collectionName
      };
      console.warn('[Firestore Subscription Error]:', JSON.stringify(errInfo));
      if (onError) onError(errInfo);
    }
  );
}

// Subscribe to a singleton document in real-time
export function subscribeToDoc<T>(
  collectionName: string,
  docId: string,
  onData: (data: T | null) => void,
  onError?: (errInfo: FirestoreErrorInfo) => void
): () => void {
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as T);
      } else {
        onData(null);
      }
    },
    (error) => {
      const errInfo: FirestoreErrorInfo = {
        error: error instanceof Error ? error.message : String(error),
        authInfo: {
          userId: auth.currentUser?.uid,
          email: auth.currentUser?.email,
          emailVerified: auth.currentUser?.emailVerified,
          isAnonymous: auth.currentUser?.isAnonymous,
          tenantId: auth.currentUser?.tenantId,
          providerInfo: auth.currentUser?.providerData?.map(provider => ({
            providerId: provider.providerId,
            email: provider.email,
          })) || []
        },
        operationType: OperationType.GET,
        path: `${collectionName}/${docId}`
      };
      console.warn('[Firestore Doc Error]:', JSON.stringify(errInfo));
      if (onError) onError(errInfo);
    }
  );
}

// Seed initial dataset if database collections are empty
export async function seedInitialFirestoreDataIfEmpty(initialData: {
  siteConfig: SchoolWebsiteConfig;
  students: Student[];
  teachers: Teacher[];
  staff: Staff[];
  administrators: Administrator[];
  transactions: FeeTransaction[];
  announcements: Announcement[];
  toppers: ClassTopper[];
  rolePermissions: RolePermissions;
  userCredentials?: UserCredential[];
}): Promise<void> {
  try {
    // Check if site_config exists
    const configSnap = await getDoc(doc(db, COLLECTIONS.SITE_CONFIG, 'current'));
    if (!configSnap.exists()) {
      console.log('[Firestore] Empty database detected. Seeding initial school dataset to Firebase...');
      const batch = writeBatch(db);

      // Site Config
      batch.set(doc(db, COLLECTIONS.SITE_CONFIG, 'current'), initialData.siteConfig);

      // Role Permissions
      batch.set(doc(db, COLLECTIONS.ROLE_PERMISSIONS, 'matrix'), initialData.rolePermissions);

      // Students
      initialData.students.forEach(st => {
        batch.set(doc(db, COLLECTIONS.STUDENTS, st.id), st);
      });

      // Teachers
      initialData.teachers.forEach(tc => {
        batch.set(doc(db, COLLECTIONS.TEACHERS, tc.id), tc);
      });

      // Staff
      initialData.staff.forEach(sf => {
        batch.set(doc(db, COLLECTIONS.STAFF, sf.id), sf);
      });

      // Administrators
      initialData.administrators.forEach(ad => {
        batch.set(doc(db, COLLECTIONS.ADMINISTRATORS, ad.id), ad);
      });

      // Transactions
      initialData.transactions.forEach(tx => {
        batch.set(doc(db, COLLECTIONS.TRANSACTIONS, tx.id), tx);
      });

      // Announcements
      initialData.announcements.forEach(an => {
        batch.set(doc(db, COLLECTIONS.ANNOUNCEMENTS, an.id), an);
      });

      // Toppers
      initialData.toppers.forEach(tp => {
        batch.set(doc(db, COLLECTIONS.TOPPERS, tp.id), tp);
      });

      // User Credentials
      if (initialData.userCredentials) {
        initialData.userCredentials.forEach(uc => {
          batch.set(doc(db, COLLECTIONS.USER_CREDENTIALS, uc.id), uc);
        });
      }

      await batch.commit();
      console.log('[Firestore] Successfully seeded initial school database to Firebase Firestore!');
    }
  } catch (error) {
    console.warn('[Firestore] Notice during initial seed check:', error);
  }
}
