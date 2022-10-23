import React, { useEffect } from 'react';
import cl from './Notification.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import { setNotificationText } from '@/store/reducers/notificationSlice';

const Notification = () => {
  const { timeout, text } = useAppSelector(state => state.notificationSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(setNotificationText(''));
    }, timeout);

    return () => clearTimeout(t);
  }, [text]);

  return (
    <AnimatePresence>
      {text && (
        <motion.div
          transition={{ duration: 0.5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cl.notificationContainer}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
