import { useState, useEffect } from 'react';
import { useAuth } from '../src/AuthContext';
import { useRouter } from 'next/router';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, where, doc, updateDoc } from 'firebase/firestore';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    carOwners: 0,
    washers: 0,
    verifiedWashers: 0,
    totalJobs: 0,
    pendingJobs: 0,
    completedJobs: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, jobs
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Admin email - CHANGE THIS TO YOUR EMAIL
  const ADMIN_EMAIL = 'tmaluleka@smb.s-plane.co.za'; // ⚠️ UPDATE THIS

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    } else if (!loading && user && user.email !== ADMIN_EMAIL) {
      alert('Access Denied: Admin only!');
      router.push('/dashboard');
    } else if (!loading && user && user.email === ADMIN_EMAIL) {
      fetchAllData();
    }
  }, [user, loading, router]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);

      // Fetch all jobs
      const jobsSnapshot = await getDocs(query(collection(db, 'jobs'), orderBy('createdAt', 'desc')));
      const jobsData = jobsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobs(jobsData);

      // Calculate stats
      const carOwners = usersData.filter(u => u.role === 'carOwner').length;
      const washers = usersData.filter(u => u.role === 'washer').length;
      const verifiedWashers = usersData.filter(u => u.role === 'washer' && u.verified).length;
      const pendingJobs = jobsData.filter(j => j.status === 'pending').length;
      const completedJobs = jobsData.filter(j => j.status === 'completed').length;
      const totalRevenue = jobsData
        .filter(j => j.status === 'completed')
        .reduce((sum, job) => sum + (job.price || 0), 0);

      setStats({
        totalUsers: usersData.length,
        carOwners,
        washers,
        verifiedWashers,
        totalJobs: jobsData.length,
        pendingJobs,
        completedJobs,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyWasher = async (userId) => {
    if (!confirm('Are you sure you want to verify this washer?')) return;
    
    try {
      await updateDoc(doc(db, 'users', userId), {
        verified: true,
        verifiedAt: new Date().toISOString()
      });
      alert('Washer verified successfully!');
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error verifying washer:', error);
      alert('Error verifying washer');
    }
  };

  const updateJobStatus = async (jobId, newStatus) => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      alert(`Job status updated to ${newStatus}!`);
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Error updating job status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.includes(searchTerm);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading || isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔄</div>
          <p style={{ fontSize: '18px', color: '#666' }}>Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>🛡️ Admin Dashboard</h1>
              <p style={{ margin: '5px 0 0', color: '#666' }}>Welcome, {user.email}</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '10px 20px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Back to Dashboard
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderBottom: '2px solid #eee' }}>
            {['overview', 'users', 'jobs'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 30px',
                  background: activeTab === tab ? '#667eea' : 'transparent',
                  color: activeTab === tab ? 'white' : '#666',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: activeTab === tab ? 'bold' : 'normal',
                  textTransform: 'capitalize'
                }}
              >
                {tab === 'overview' && '📊'} {tab === 'users' && '👥'} {tab === 'jobs' && '🚗'} {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <StatCard icon="👥" title="Total Users" value={stats.totalUsers} color="#667eea" />
              <StatCard icon="🚗" title="Car Owners" value={stats.carOwners} color="#48bb78" />
              <StatCard icon="🧽" title="Washers" value={stats.washers} color="#ed8936" />
              <StatCard icon="✅" title="Verified Washers" value={stats.verifiedWashers} color="#38b2ac" />
              <StatCard icon="📋" title="Total Jobs" value={stats.totalJobs} color="#9f7aea" />
              <StatCard icon="⏳" title="Pending Jobs" value={stats.pendingJobs} color="#ecc94b" />
              <StatCard icon="✔️" title="Completed Jobs" value={stats.completedJobs} color="#48bb78" />
              <StatCard icon="💰" title="Total Revenue" value={`R${stats.totalRevenue.toLocaleString()}`} color="#f56565" />
            </div>

            {/* Recent Activity */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <h2 style={{ margin: '0 0 20px', fontSize: '22px' }}>📈 Recent Activity</h2>
              <div style={{ display: 'grid', gap: '15px' }}>
                <ActivityItem 
                  icon="👤" 
                  text={`${stats.totalUsers} users registered`} 
                  color="#667eea" 
                />
                <ActivityItem 
                  icon="🚗" 
                  text={`${stats.pendingJobs} jobs waiting for washers`} 
                  color="#ecc94b" 
                />
                <ActivityItem 
                  icon="✅" 
                  text={`${stats.completedJobs} jobs completed`} 
                  color="#48bb78" 
                />
                <ActivityItem 
                  icon="💵" 
                  text={`R${stats.totalRevenue.toLocaleString()} total revenue generated`} 
                  color="#f56565" 
                />
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div>
            {/* Filters */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="🔍 Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '250px',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  style={{
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">All Roles</option>
                  <option value="carOwner">Car Owners</option>
                  <option value="washer">Washers</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Name</th>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Email</th>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Phone</th>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Role</th>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                      <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, idx) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? 'white' : '#f9fafb' }}>
                        <td style={{ padding: '15px' }}>{user.name || 'N/A'}</td>
                        <td style={{ padding: '15px' }}>{user.email}</td>
                        <td style={{ padding: '15px' }}>{user.phone || 'N/A'}</td>
                        <td style={{ padding: '15px' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            background: user.role === 'carOwner' ? '#c6f6d5' : '#fed7d7',
                            color: user.role === 'carOwner' ? '#22543d' : '#742a2a'
                          }}>
                            {user.role === 'carOwner' ? '🚗 Owner' : '🧽 Washer'}
                          </span>
                        </td>
                        <td style={{ padding: '15px' }}>
                          {user.role === 'washer' && (
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '14px',
                              background: user.verified ? '#c6f6d5' : '#feebc8',
                              color: user.verified ? '#22543d' : '#7c2d12'
                            }}>
                              {user.verified ? '✅ Verified' : '⏳ Pending'}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '15px' }}>
                          {user.role === 'washer' && !user.verified && (
                            <button
                              onClick={() => verifyWasher(user.id)}
                              style={{
                                padding: '8px 16px',
                                background: '#48bb78',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}
                            >
                              ✅ Verify
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  No users found
                </div>
              )}
            </div>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Job ID</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Service</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Vehicle</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Price</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Date</th>
                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, idx) => (
                    <tr key={job.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? 'white' : '#f9fafb' }}>
                      <td style={{ padding: '15px', fontSize: '12px', color: '#666' }}>{job.id.substring(0, 8)}...</td>
                      <td style={{ padding: '15px' }}>{job.serviceType}</td>
                      <td style={{ padding: '15px' }}>{job.vehicleType}</td>
                      <td style={{ padding: '15px', fontWeight: 'bold', color: '#48bb78' }}>R{job.price}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          background: job.status === 'completed' ? '#c6f6d5' : job.status === 'pending' ? '#feebc8' : '#fed7d7',
                          color: job.status === 'completed' ? '#22543d' : job.status === 'pending' ? '#7c2d12' : '#742a2a'
                        }}>
                          {job.status === 'completed' ? '✅' : job.status === 'pending' ? '⏳' : '❌'} {job.status}
                        </span>
                      </td>
                      <td style={{ padding: '15px', fontSize: '14px' }}>
                        {job.scheduledAt ? new Date(job.scheduledAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '15px' }}>
                        {job.status === 'pending' && (
                          <button
                            onClick={() => updateJobStatus(job.id, 'completed')}
                            style={{
                              padding: '6px 12px',
                              background: '#48bb78',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              marginRight: '5px'
                            }}
                          >
                            ✅ Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {jobs.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                No jobs found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ icon, title, value, color }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '25px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>{title}</div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color: color }}>{value}</div>
    </div>
  );
}

function ActivityItem({ icon, text, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '15px',
      background: '#f7fafc',
      borderRadius: '8px',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: '24px' }}>{icon}</div>
      <div style={{ fontSize: '16px', color: '#4a5568' }}>{text}</div>
    </div>
  );
}
