"use client";
import { useSession } from "next-auth/react";
import styles from '../page.module.css'
import { Button } from "devextreme-react";
import { useRouter } from "next/navigation";
function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter()
  if (status === "loading") {
    return <h1>Loading...</h1>;
  }

  if (status === "unauthenticated") {
    return (
      <div className={styles["login-form__container"]} style={{display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center"}}>
      <h1 id="dashboard__access-denied">Access Denied</h1>
      <Button 
        text="Log In"
        onClick={() => router.replace('/')}
      />
    </div>    
  
    )
  }
  return (
  
  <div className={styles["login-form__container"]} style={{display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center"}}>
    <h1 id="dashboard__welcome-user">Welcome</h1>
    <h2 style={{textAlign: 'center'}}>{session.user.email}</h2>

    <p style={{textAlign: 'center'}}>You have been logged in successfully</p>
  </div>    
)
}

export default Dashboard;
