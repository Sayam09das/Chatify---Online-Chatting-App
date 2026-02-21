# TODO: WhatsApp-style Online Status & Last Seen Implementation

## Phase 1: Backend - Socket.io Enhancement ✅
- [x] 1. Update server.js - Add connected users tracking Map
- [x] 2. Add socket events: addUser, removeUser, userStatusChange
- [x] 3. Update database on connect/disconnect
- [x] 4. Broadcast status changes to all clients

## Phase 2: Backend - Users Routes ✅
- [x] 5. Create users routes (GET /api/users)
- [x] 6. Add endpoint to get user statuses

## Phase 3: Frontend - Conversation.jsx ✅
- [x] 7. Update to fetch user statuses from API
- [x] 8. Listen for socket status changes
- [x] 9. Pass lastSeen data to Sidebar

## Phase 4: Frontend - Sidebar.jsx ✅
- [x] 10. Update to show formatted "last seen X" 
- [x] 11. Accept lastSeen prop and display properly

## Phase 5: Frontend - ChatArea.jsx ✅
- [x] 12. Update ChatHeader to show proper last seen
- [x] 13. Format last seen time (e.g., "last seen 5 min ago")

## Phase 6: Testing
- [ ] 14. Test online/offline status updates
- [ ] 15. Test last seen time formatting

