import React, { useState, useEffect } from 'react';
import { Bot, Key, X, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserData, saveUserData } from '../../lib/db';
