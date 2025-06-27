import { useState, useEffect } from 'react' // Import des hooks React
import reactLogo from './assets/react.svg' // Import du logo React
import viteLogo from '/vite.svg' // Import du logo Vite
import './App.css' // Import des styles CSS

export default function App() {
  // 🔹 Initialisation de l'état avec localStorage pour la configuration
  const [userName, setUserName] = useState(() => {
    const saved = localStorage.getItem("userName")
    return saved || ""
  })
  
  const [listName, setListName] = useState(() => {
    const saved = localStorage.getItem("listName")
    return saved || ""
  })
  
  const [isConfigured, setIsConfigured] = useState(() => {
    const saved = localStorage.getItem("isConfigured")
    return saved === "true"
  })

  // 🔹 Initialisation de l'état des tâches avec localStorage
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks") // Récupère les tâches sauvegardées
    return savedTasks ? JSON.parse(savedTasks) : [] // Si elles existent, on les parse, sinon on retourne un tableau vide
  })

  const [newTask, setNewTask] = useState("") // 🔹 État pour la nouvelle tâche

  // 🔹 useEffect pour sauvegarder la configuration dans localStorage
  useEffect(() => {
    localStorage.setItem("userName", userName)
    localStorage.setItem("listName", listName)
    localStorage.setItem("isConfigured", isConfigured.toString())
  }, [userName, listName, isConfigured])

  // 🔹 useEffect pour sauvegarder les tâches dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks)) // Met à jour localStorage à chaque changement de `tasks`
  }, [tasks]) // Se déclenche uniquement si `tasks` change

  const handleConfiguration = (e) => {
    e.preventDefault()
    if (userName.trim() && listName.trim()) {
      setIsConfigured(true)
    }
  }

  // 🔹 Fonction pour ajouter une nouvelle tâche
  const addTask = (e) => {
    e.preventDefault() // Empêche le rechargement de la page
    if (newTask.trim() === "") return // Empêche d'ajouter une tâche vide

    const newTodo = {
      id: Date.now(), // Utilisation d'un ID unique basé sur la date
      text: newTask,
      completed: false
    }

    setTasks([...tasks, newTodo]) // Ajoute la nouvelle tâche à la liste
    setNewTask("") // Réinitialise le champ de texte
  }

  // 🔹 Fonction pour cocher/décocher une tâche
  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  // 🔹 Fonction pour supprimer une tâche
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id)) // Filtre la liste pour retirer la tâche sélectionnée
  }

  // 🔹 Fonction pour réinitialiser l'application
  const resetApp = () => {
    setIsConfigured(false)
    setUserName("")
    setListName("")
    setTasks([])
    localStorage.removeItem("userName")
    localStorage.removeItem("listName")
    localStorage.removeItem("isConfigured")
    localStorage.removeItem("tasks")
  }

  return (
    <>
      <div className="particles">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      
      {!isConfigured ? (
        <div className="configuration-container">
          <div className="welcome-card">
            <h1>Bienvenue dans votre ToDoList</h1>
            <form onSubmit={handleConfiguration}>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Votre prénom"
                required
              />
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Nom de votre liste"
                required
              />
              <button type="submit">Commencer</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="app-container">
          <div className="todo-container">
            <div className="header">
              <h1>Bienvenue {userName} !</h1>
              <h2>{listName} :</h2>
              <button className="reset-btn" onClick={resetApp}>🔄 Réinitialiser</button>
            </div>
            
            <form onSubmit={addTask} className="task-form">
              <input 
                type="text" 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)} 
                placeholder="Ajouter une nouvelle tâche"
              />
              <button type="submit">+</button>
            </form>

            <div className="tasks-list">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <p>🎯 Aucune tâche pour le moment</p>
                  <p>Ajoutez votre première tâche ci-dessus !</p>
                </div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => toggleTask(task.id)} 
                    />
                    <span>{task.text}</span>
                    <button className="delete-btn" onClick={() => deleteTask(task.id)}>×</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
