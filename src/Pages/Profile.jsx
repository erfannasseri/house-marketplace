import { getAuth , updateProfile} from 'firebase/auth'
import { db } from '../firebase.config'
import { useNavigate , Link } from 'react-router-dom'
import React from 'react'
import { toast } from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore'
import { useState, useEffect } from 'react'
import Listingitem from '../Components/ListingItem'
import Listings from '../Components/Listings'




function Profile() {
  const auth = getAuth()
  const [changeDetails ,setChangeDetails] = useState(false)
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const [formData, setFormData] = useState({
    name : auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  const navigate = useNavigate()

  const {name , email}= formData
  
  const onLogOut = ()=>{
    auth.signOut()
    navigate('/house-marketplace')
  }
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listing')

      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      )

      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setLoading(false)
    }

    fetchUserListings()
  }, [auth.currentUser.uid || Listings ])

  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listing', listingId))
      const updatedListings = listings.filter(
        (listing) => listings.id !== listingId
      )
      setListings(updatedListings)
      toast.success('Successfully deleted listing')
    }
  }

  const onEdit = (listingId) => navigate(`/house-marketplace/edit-listing/${listingId}`)

  const onSubmit = async ()=>{
    try {
      //Update firebase
      if(auth.currentUser.displayName!==name){
        await updateProfile(auth.currentUser,{
          displayName : name
        })}
      
      //Update FireStore
      const userRef = doc (db,'users',auth.currentUser.uid)
      await updateDoc (userRef , {
        name: name
      })
      }
    catch (error) {
      console.log(error)
      toast.error('Somthing went wrong!')
    }
  }

  const onChange = (e)=>{
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id] : e.target.value
    }))
  }

  return (
    <div className="profile rtl">
      <header className='profileHeader'>
        <p className='pageHeader'>پروفایل من</p>
        <button type='button' className='logOut' onClick={onLogOut}>خروج</button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">
             اطلاعات شخصی
          </p>
          <p className='changePersonalDetails' onClick={()=>{
            changeDetails && onSubmit()
            setChangeDetails((prevState)=>!prevState)
          }}> {changeDetails ? 'انجام شد':'تغییر'} </p>
        </div>

        <div className="profileCard ltr">
          <input 
          type="text" 
          id="name" 
          className={changeDetails?'profileNameActive':'profileName'}
          disabled={!changeDetails} 
          value={name}
          onChange={onChange}
          />
          <input 
          type="text" 
          id="email" 
          className={changeDetails?'profileEmail':'profileEmail'}
          disabled={!changeDetails} 
          value={email}
          onChange={onChange}
          />
        </div>
        <Link to='/house-marketplace/create-listing' className='createListing'>
          <img src={homeIcon} alt="home" />
          <p>فروش یا اجاره منزل شما</p>
          <img src={arrowRight} alt="arrowRight" />
        </Link>
        {!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>آگهی های شما</p>
            <div>
              {listings.map((listing) => (
                <Listingitem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Profile